/* Cay's English - logika aplikasi.
 * Materi ada di folder content/ (JSON). File ini tidak perlu diubah saat menambah unit.
 */
(function () {
  'use strict';

  var APP_VERSION = '1.0.0';
  var STORE_KEY = 'caysenglish.progress.v1';
  var INTERVALS = [1, 3, 7, 14]; // hari, kotak 1-4 (Leitner)
  var REVIEW_MAX = 15;
  var GOALS = [10, 20, 40, 60];

  var $app = document.getElementById('app');
  var $toast = document.getElementById('toast');
  var G = window.Grading;

  // ------------------------------------------------------------ util
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayStr(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function parseDay(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(s, n) { var d = parseDay(s); d.setDate(d.getDate() + n); return todayStr(d); }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function shuffledIndexes(n, avoidIdentity) {
    var idx = []; for (var i = 0; i < n; i++) idx.push(i);
    for (var tries = 0; tries < 8; tries++) {
      var s = shuffle(idx);
      if (!avoidIdentity || n < 2 || s.some(function (v, k) { return v !== k; })) return s;
    }
    return idx.reverse();
  }
  function stars(n) { var s = ''; for (var i = 0; i < 3; i++) s += i < n ? '★' : '☆'; return s; }
  function starsFor(score) { return score >= 1 ? 3 : score >= 0.8 ? 2 : score >= 0.6 ? 1 : 0; }
  function blankify(text) { return esc(text).replace(/_{3,}/g, '<span class="blank">&nbsp;</span>'); }

  var ICON = {
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.4 5.6a9 9 0 0 1 0 12.8"/></svg>'
  };

  function toast(msg, actionLabel, action, ms) {
    $toast.innerHTML = '<span>' + esc(msg) + '</span>' + (actionLabel ? '<button type="button">' + esc(actionLabel) + '</button>' : '');
    $toast.hidden = false;
    if (actionLabel) $toast.querySelector('button').onclick = function () { $toast.hidden = true; action(); };
    clearTimeout(toast._t);
    if (!actionLabel || ms) toast._t = setTimeout(function () { $toast.hidden = true; }, ms || 3000);
  }

  // Dialog konfirmasi buatan sendiri (tanpa alert/confirm bawaan browser).
  function dialog(opts) {
    var back = document.createElement('div');
    back.className = 'dialog-back';
    back.innerHTML = '<div class="dialog" role="dialog" aria-modal="true"><h3>' + esc(opts.title) + '</h3>' +
      (opts.text ? '<p class="muted">' + esc(opts.text) + '</p>' : '') +
      '<button type="button" class="btn ' + (opts.danger ? 'danger' : '') + '" data-ok>' + esc(opts.ok || 'Ya') + '</button>' +
      '<button type="button" class="btn secondary" data-cancel>' + esc(opts.cancel || 'Batal') + '</button></div>';
    document.body.appendChild(back);
    function close() { back.remove(); }
    back.querySelector('[data-ok]').onclick = function () { close(); opts.onOk && opts.onOk(); };
    back.querySelector('[data-cancel]').onclick = function () { close(); opts.onCancel && opts.onCancel(); };
    back.onclick = function (e) { if (e.target === back) close(); };
  }

  // ------------------------------------------------------------ penyimpanan progres
  function defaultProgress() {
    return {
      version: 1,
      createdAt: todayStr(),
      xp: 0,
      xpByDate: {},
      streak: { count: 0, lastDate: null },
      dailyGoal: 20,
      placement: { done: false, skipped: false, recommendedUnit: null, unlockedUpTo: 0, score: null, date: null },
      units: {},
      review: {},
      settings: { voice: 'en-GB', rate: 0.9 },
      persisted: null
    };
  }
  function merge(base, saved) {
    var out = base;
    Object.keys(saved || {}).forEach(function (k) {
      if (saved[k] && typeof saved[k] === 'object' && !Array.isArray(saved[k]) && base[k] && typeof base[k] === 'object') out[k] = merge(base[k], saved[k]);
      else out[k] = saved[k];
    });
    return out;
  }
  var storageOk = true;
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultProgress();
      var saved = JSON.parse(raw);
      if (!saved || saved.version !== 1) return defaultProgress();
      return merge(defaultProgress(), saved);
    } catch (e) {
      storageOk = false;
      return defaultProgress();
    }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(P)); storageOk = true; }
    catch (e) { storageOk = false; toast('Progres gagal disimpan di HP ini.'); }
  }
  var P = load();

  function isValidBackup(o) {
    return o && o.version === 1 && typeof o.xp === 'number' && o.units && typeof o.units === 'object' && o.review && typeof o.review === 'object';
  }

  // ------------------------------------------------------------ materi
  var INDEX = null, PLACEMENT = null, UNIT_CACHE = {};
  function getJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      return r.json();
    });
  }
  function unitInfo(n) { return INDEX.units.filter(function (u) { return u.n === n; })[0]; }
  function availableUnits() { return INDEX.units.filter(function (u) { return u.available; }).map(function (u) { return u.n; }); }
  function lastAvailable() { var a = availableUnits(); return a.length ? a[a.length - 1] : 0; }
  function loadUnit(n) {
    if (UNIT_CACHE[n]) return Promise.resolve(UNIT_CACHE[n]);
    var info = unitInfo(n);
    if (!info || !info.available) return Promise.reject(new Error('Unit ' + n + ' belum tersedia'));
    return getJSON('content/units/' + info.file).then(function (u) { UNIT_CACHE[n] = u; return u; });
  }

  // ------------------------------------------------------------ status unit
  function unitProg(n) { return P.units[n] || {}; }
  function isUnlocked(n) {
    var info = unitInfo(n);
    if (!info || !info.available) return false;
    var av = availableUnits();
    if (n === av[0]) return true;
    if (n <= (P.placement.unlockedUpTo || 0)) return true;
    if (unitProg(n).unlocked) return true;
    var prev = av[av.indexOf(n) - 1];
    return prev != null && (unitProg(prev).stars || 0) >= 1;
  }
  function unitStatus(n) {
    var info = unitInfo(n);
    if (!info || !info.available) return 'soon';
    if ((unitProg(n).stars || 0) >= 1) return 'done';
    return isUnlocked(n) ? 'open' : 'locked';
  }
  function currentUnit() {
    var av = availableUnits();
    for (var i = 0; i < av.length; i++) if (unitStatus(av[i]) === 'open') return av[i];
    return null;
  }

  // ------------------------------------------------------------ XP, streak, target
  function addXP(n) {
    if (!n) return;
    var t = todayStr();
    P.xp += n;
    P.xpByDate[t] = (P.xpByDate[t] || 0) + n;
    var keys = Object.keys(P.xpByDate).sort();
    while (keys.length > 60) delete P.xpByDate[keys.shift()];
  }
  function markActivity() {
    var t = todayStr(), last = P.streak.lastDate;
    if (last === t) return;
    P.streak.count = last === addDays(t, -1) ? P.streak.count + 1 : 1;
    P.streak.lastDate = t;
  }
  function streakNow() {
    var t = todayStr(), last = P.streak.lastDate;
    return last === t || last === addDays(t, -1) ? P.streak.count : 0;
  }
  function todayXP() { return P.xpByDate[todayStr()] || 0; }

  // ------------------------------------------------------------ ulasan (pengulangan berjarak)
  function scheduleWrong(q) {
    P.review[q.id] = { box: 1, due: addDays(todayStr(), 1), unit: q.ref };
  }
  function reviewResult(id, ok) {
    var r = P.review[id];
    if (!r) return;
    if (!ok) { r.box = 1; r.due = addDays(todayStr(), 1); return; }
    if (r.box >= INTERVALS.length) { delete P.review[id]; return; }
    r.box += 1;
    r.due = addDays(todayStr(), INTERVALS[r.box - 1]);
  }
  function dueReviewIds() {
    var t = todayStr();
    return Object.keys(P.review).filter(function (id) { return P.review[id].due <= t; })
      .sort(function (a, b) { return P.review[a].due < P.review[b].due ? -1 : 1; });
  }

  // ------------------------------------------------------------ suara (Web Speech API)
  var tts = { voice: null, ok: false };
  function pickVoice() {
    if (!('speechSynthesis' in window)) { tts.ok = false; return; }
    var voices = window.speechSynthesis.getVoices() || [];
    function find(lang) {
      return voices.filter(function (v) { return v.lang && v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase(); })[0];
    }
    var pref = P.settings.voice || 'en-GB';
    var other = pref === 'en-GB' ? 'en-US' : 'en-GB';
    tts.voice = find(pref) || find(other) || voices.filter(function (v) { return /^en/i.test(v.lang || ''); })[0] || null;
    tts.ok = !!tts.voice;
    document.body.classList.toggle('tts-on', tts.ok);
  }
  function speak(text) {
    if (!tts.ok) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.voice = tts.voice; u.lang = tts.voice.lang; u.rate = P.settings.rate || 0.9;
      window.speechSynthesis.speak(u);
    } catch (e) { /* abaikan */ }
  }
  function speakBtn(text) {
    return '<button type="button" class="icon-btn speak" data-speak="' + esc(text) + '" aria-label="Dengarkan">' + ICON.speaker + '</button>';
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-speak]');
    if (b) { e.preventDefault(); speak(b.getAttribute('data-speak')); }
  });

  // ------------------------------------------------------------ router
  var session = null;
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function route() {
    var h = location.hash || '#/';
    window.scrollTo(0, 0);
    var m;
    if (h === '#/' || h === '#') {
      session = null;
      if (!P.placement.done && !P.placement.skipped) return renderWelcome();
      return renderHome();
    }
    if (h === '#/placement') return startPlacement();
    if ((m = /^#\/unit\/(\d+)$/.exec(h))) return startLesson(+m[1]);
    if (h === '#/review') return startReview();
    if (h === '#/settings') { session = null; return renderSettings(); }
    go('#/');
  }

  // ------------------------------------------------------------ layar: sambutan
  function renderWelcome() {
    $app.innerHTML =
      '<div class="screen"><div class="screen-body">' +
      '<div class="app-title">Cay\'s English</div>' +
      '<h1>Halo! Ayo perbaiki grammar bahasa Inggris Anda, satu unit setiap hari.</h1>' +
      '<p>Materinya mengikuti urutan 145 unit buku <i>English Grammar in Use</i> (Raymond Murphy, edisi kelima). Setiap soal mencantumkan nomor unit buku, jadi Anda bisa membuka bukunya untuk pendalaman.</p>' +
      '<div class="card"><div class="k">Tes penempatan</div><p class="text">20 soal pilihan ganda, sekitar 5 menit.</p><p class="muted small-text">Hasilnya merekomendasikan unit awal. Unit sebelum rekomendasi tetap terbuka dan bisa dikerjakan kapan saja.</p></div>' +
      '</div><div class="action-bar">' +
      '<button type="button" class="btn" data-act="placement">Mulai tes penempatan</button>' +
      '<button type="button" class="btn secondary" data-act="skip">Lewati, mulai dari Unit 1</button>' +
      '</div></div>';
    $app.querySelector('[data-act=placement]').onclick = function () { go('#/placement'); };
    $app.querySelector('[data-act=skip]').onclick = function () {
      P.placement.skipped = true; save(); go('#/');
    };
  }

  // ------------------------------------------------------------ layar: beranda / peta jalur
  function goalRing() {
    var pct = Math.min(1, todayXP() / (P.dailyGoal || 20));
    var r = 14, c = 2 * Math.PI * r;
    return '<svg class="goal-ring" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="' + r + '" fill="none" stroke="#e3e0d6" stroke-width="5"/>' +
      '<circle cx="17" cy="17" r="' + r + '" fill="none" stroke="' + (pct >= 1 ? '#b7860f' : '#1f6f5c') + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="' + (c * pct).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 17 17)"/></svg>';
  }
  function renderHome() {
    var cur = currentUnit();
    var due = dueReviewIds().length;
    var html = '<div class="screen">' +
      '<div class="app-title"><span>Cay\'s English</span><button type="button" class="icon-btn" data-act="settings" aria-label="Pengaturan">' + ICON.gear + '</button></div>' +
      '<div class="stats">' +
      '<div class="stat"><span class="ico" aria-hidden="true">🔥</span><div><b>' + streakNow() + '</b><span>hari streak</span></div></div>' +
      '<div class="stat">' + goalRing() + '<div><b>' + todayXP() + '/' + P.dailyGoal + '</b><span>XP hari ini</span></div></div>' +
      '<div class="stat"><span class="ico" aria-hidden="true">⭐</span><div><b>' + P.xp + '</b><span>total XP</span></div></div>' +
      '</div><div class="screen-body">';
    if (due > 0) {
      html += '<button type="button" class="review-banner" data-act="review"><span style="font-size:26px" aria-hidden="true">🔁</span><div><b>Ulasan kesalahan: ' + due + ' soal</b><span class="muted small-text">Ulangi soal yang pernah salah agar tidak terulang.</span></div></button>';
    }
    if (P.placement.done && P.placement.recommendedUnit && P.placement.recommendedUnit > lastAvailable() && !cur) {
      html += '<div class="card small-text">Rekomendasi tes penempatan: Unit ' + P.placement.recommendedUnit + '. Unit itu belum tersedia, jadi lanjutkan unit yang ada atau minta unit berikutnya ditambahkan.</div>';
    }
    INDEX.paths.forEach(function (path) {
      var units = path.units;
      var avail = units.filter(function (n) { var u = unitInfo(n); return u && u.available; });
      var done = units.filter(function (n) { return unitStatus(n) === 'done'; }).length;
      html += '<section class="path"><div class="path-head' + (avail.length ? '' : ' soon') + '">' +
        '<div class="label">Jalur ' + path.id + ' · Unit ' + units[0] + '–' + units[units.length - 1] + '</div>' +
        '<div class="name">' + esc(path.nameId) + '</div>' +
        '<div class="meta">' + esc(path.name) + ' · ' + (avail.length ? done + '/' + units.length + ' selesai' : 'segera hadir') + '</div></div><div class="nodes">';
      units.forEach(function (n) {
        var info = unitInfo(n), st = unitStatus(n), up = unitProg(n);
        var cls = 'node ' + st + (n === cur ? ' current' : '');
        var sub = st === 'soon' ? '<span class="badge soon">Segera</span>' :
          st === 'locked' ? 'Terkunci' :
          st === 'done' ? '<span class="stars" aria-label="' + up.stars + ' bintang">' + stars(up.stars) + '</span> nilai terbaik ' + Math.round((up.bestScore || 0) * 100) + '%' :
          (n === cur ? '<span class="badge">Mulai di sini</span>' : 'Terbuka');
        html += '<button type="button" class="' + cls + '" data-unit="' + n + '"' + (st === 'soon' || st === 'locked' ? ' aria-disabled="true"' : '') + '>' +
          '<span class="circle">' + (st === 'locked' ? '🔒' : n) + '</span><span class="info"><span class="t">' + esc(info.titleId || info.title) + '</span><br>' +
          '<span class="s">' + (info.titleId ? esc(info.title) + '<br>' : '') + sub + '</span></span></button>';
      });
      html += '</div></section>';
    });
    html += '<p class="muted small-text center">Unit ' + availableUnits()[0] + '–' + lastAvailable() + ' tersedia dari 145 unit.</p></div></div>';
    $app.innerHTML = html;
    $app.querySelector('[data-act=settings]').onclick = function () { go('#/settings'); };
    var rb = $app.querySelector('[data-act=review]');
    if (rb) rb.onclick = function () { go('#/review'); };
    $app.querySelectorAll('[data-unit]').forEach(function (b) {
      b.onclick = function () {
        var n = +b.getAttribute('data-unit'), st = unitStatus(n);
        if (st === 'soon') return toast('Unit ' + n + ' belum tersedia. Minta unit ini ditambahkan.');
        if (st === 'locked') return toast('Selesaikan unit sebelumnya dulu (minimal 1 bintang).');
        go('#/unit/' + n);
      };
    });
    var curEl = $app.querySelector('.node.current');
    if (curEl && curEl.scrollIntoView) setTimeout(function () { curEl.scrollIntoView({ block: 'center' }); }, 30);
  }

  // ------------------------------------------------------------ layar: tes penempatan
  function startPlacement() {
    var p = PLACEMENT ? Promise.resolve(PLACEMENT) : getJSON('content/placement.json').then(function (d) { PLACEMENT = d; return d; });
    p.then(function (data) {
      session = { kind: 'placement', qs: data.questions, idx: 0, answers: [], order: null };
      renderPlacementQ();
    }).catch(loadError);
  }
  function renderPlacementQ() {
    var s = session, q = s.qs[s.idx];
    s.order = shuffledIndexes(q.choices.length, false);
    s.sel = null;
    $app.innerHTML = '<div class="screen"><div class="topbar">' +
      '<button type="button" class="icon-btn" data-act="exit" aria-label="Keluar">' + ICON.close + '</button>' +
      '<div class="progress"><i style="width:' + Math.round(s.idx / s.qs.length * 100) + '%"></i></div>' +
      '<span class="muted small-text">' + (s.idx + 1) + '/' + s.qs.length + '</span></div>' +
      '<div class="screen-body"><div class="q-type">Tes penempatan</div>' +
      '<div class="q-prompt">' + blankify(q.prompt) + '</div><div class="choices">' +
      s.order.map(function (oi) { return '<button type="button" class="choice" data-i="' + oi + '">' + esc(q.choices[oi]) + '</button>'; }).join('') +
      '</div><p class="hint">Tidak yakin? Pilih saja yang paling mungkin. Hasilnya hanya untuk rekomendasi.</p></div>' +
      '<div class="action-bar"><button type="button" class="btn" data-act="next" disabled>Lanjut</button></div></div>';
    $app.querySelectorAll('.choice').forEach(function (b) {
      b.onclick = function () {
        $app.querySelectorAll('.choice').forEach(function (x) { x.classList.remove('sel'); });
        b.classList.add('sel'); s.sel = +b.getAttribute('data-i');
        $app.querySelector('[data-act=next]').disabled = false;
      };
    });
    $app.querySelector('[data-act=exit]').onclick = function () {
      dialog({ title: 'Keluar dari tes penempatan?', text: 'Jawaban tes belum disimpan. Anda bisa mengulang tes dari Pengaturan.', ok: 'Keluar', onOk: function () { go('#/'); } });
    };
    $app.querySelector('[data-act=next]').onclick = function () {
      s.answers.push(s.sel === q.correct);
      s.idx++;
      if (s.idx < s.qs.length) renderPlacementQ(); else finishPlacement();
    };
  }
  function finishPlacement() {
    var s = session, firstWrong = null, correct = 0;
    s.qs.forEach(function (q, i) { if (s.answers[i]) correct++; else if (firstWrong == null) firstWrong = q.unit; });
    var la = lastAvailable();
    var rec = firstWrong != null ? firstWrong : la + 1;
    var startAt = Math.min(rec, la);
    P.placement = { done: true, skipped: false, recommendedUnit: rec, unlockedUpTo: startAt, score: correct + '/' + s.qs.length, date: todayStr() };
    save();
    var recInfo = unitInfo(rec);
    var html = '<div class="screen"><div class="screen-body"><div class="result-hero"><div style="font-size:54px" aria-hidden="true">🧭</div>' +
      '<h1>Hasil tes penempatan</h1><p class="muted">Benar ' + correct + ' dari ' + s.qs.length + ' soal.</p></div>';
    if (firstWrong == null) {
      html += '<div class="card"><p class="text">Semua jawaban benar!</p><p>Unit yang tersedia saat ini (Unit 1–' + la + ') sudah terbuka semua. Kerjakan untuk mendapatkan bintang, atau minta unit berikutnya ditambahkan.</p></div>';
    } else {
      html += '<div class="card"><div class="k">Rekomendasi</div><p class="text">Mulai dari <b>Unit ' + rec + '</b>' + (recInfo ? ': ' + esc(recInfo.titleId || recInfo.title) : '') + '</p>' +
        (rec > la ? '<p class="muted">Unit ' + rec + ' belum tersedia di aplikasi. Untuk sementara, kerjakan Unit ' + la + ' dan unit sebelumnya.</p>' : '<p class="muted">Unit 1–' + (startAt - 1 > 0 ? startAt - 1 : 1) + ' tetap terbuka jika Anda ingin mengulang dasar.</p>') + '</div>';
    }
    html += '</div><div class="action-bar"><button type="button" class="btn" data-act="start">' + (firstWrong == null ? 'Ke peta jalur' : 'Mulai Unit ' + startAt) + '</button>' +
      (firstWrong == null ? '' : '<button type="button" class="btn secondary" data-act="home">Lihat peta jalur</button>') + '</div></div>';
    $app.innerHTML = html;
    $app.querySelector('[data-act=start]').onclick = function () { go(firstWrong == null ? '#/' : '#/unit/' + startAt); };
    var h = $app.querySelector('[data-act=home]'); if (h) h.onclick = function () { go('#/'); };
  }

  // ------------------------------------------------------------ layar: pelajaran
  function startLesson(n) {
    var st = unitStatus(n);
    if (st === 'soon' || st === 'locked') { toast(st === 'soon' ? 'Unit ' + n + ' belum tersedia.' : 'Unit ini masih terkunci.'); return go('#/'); }
    loadUnit(n).then(function (unit) {
      var lesson = unit.lessons[0];
      session = {
        kind: 'lesson', unit: unit, lesson: lesson, cardIdx: 0,
        queue: lesson.questions.map(function (q) { return { q: q, retry: false }; }),
        total: lesson.questions.length, idx: 0, firstOk: 0, mistakes: [], xp: 0, retried: {}
      };
      renderCard();
    }).catch(loadError);
  }
  function lessonTop(pct) {
    return '<div class="topbar"><button type="button" class="icon-btn" data-act="exit" aria-label="Keluar">' + ICON.close + '</button>' +
      '<div class="progress"><i style="width:' + Math.round(pct * 100) + '%"></i></div></div>';
  }
  function bindExit() {
    var b = $app.querySelector('[data-act=exit]');
    if (!b) return;
    b.onclick = function () {
      if (session && session.kind === 'review' && session.idx === 0) return go('#/');
      dialog({ title: 'Keluar sekarang?', text: 'XP dari jawaban yang sudah benar tetap tersimpan. Bintang unit hanya didapat jika pelajaran selesai.', ok: 'Keluar', cancel: 'Lanjut belajar', onOk: function () { go('#/'); } });
    };
  }
  function renderCard() {
    var s = session, cards = s.lesson.cards, c = cards[s.cardIdx];
    var html = '<div class="screen">' + lessonTop(0) + '<div class="screen-body">' +
      '<div class="q-type">Unit ' + s.unit.unit + ' · ' + esc(s.unit.title) + '</div>' +
      '<div class="card"><div class="k">Penjelasan ' + (s.cardIdx + 1) + ' dari ' + cards.length + '</div>' +
      '<p class="text">' + esc(c.text) + '</p>';
    (c.examples || []).forEach(function (ex) {
      html += '<div class="example">' + speakBtn(ex.en) + '<div><div class="en">' + esc(ex.en) + '</div>' + (ex.id ? '<div class="id">' + esc(ex.id) + '</div>' : '') + '</div></div>';
    });
    if (c.trap) html += '<div class="trap"><b>Jebakan:</b> ' + esc(c.trap) + '</div>';
    html += '</div><p class="muted small-text">Rujukan: Unit ' + s.unit.unit + ', English Grammar in Use.</p></div><div class="action-bar">' +
      '<button type="button" class="btn" data-act="next">' + (s.cardIdx < cards.length - 1 ? 'Lanjut' : 'Mulai latihan (' + s.total + ' soal)') + '</button>' +
      (s.cardIdx > 0 ? '<button type="button" class="btn ghost" data-act="prev">Kembali</button>' : '') + '</div></div>';
    $app.innerHTML = html;
    bindExit();
    $app.querySelector('[data-act=next]').onclick = function () {
      if (s.cardIdx < cards.length - 1) { s.cardIdx++; renderCard(); window.scrollTo(0, 0); }
      else renderQuestion();
    };
    var pv = $app.querySelector('[data-act=prev]');
    if (pv) pv.onclick = function () { s.cardIdx--; renderCard(); };
  }

  var TYPE_LABEL = {
    choice: 'Pilih jawaban yang benar',
    fill: 'Isi bagian yang kosong',
    verbform: 'Ubah bentuk kata kerja dalam kurung',
    order: 'Susun kalimat',
    correct: 'Perbaiki kalimat jika salah',
    match: 'Jodohkan',
    translate: 'Terjemahkan ke bahasa Inggris'
  };

  // Menggambar satu soal. onAnswer(response) dipanggil saat tombol Periksa ditekan.
  function questionUI(q, $body, setReady) {
    var ui = { response: null };
    var h = '<div class="q-type">' + TYPE_LABEL[q.type] + '</div>';
    if (q.type === 'choice') {
      ui.order = shuffledIndexes(q.choices.length, false);
      h += '<div class="q-prompt">' + blankify(q.prompt) + '</div><div class="choices">' +
        ui.order.map(function (oi) { return '<button type="button" class="choice" data-i="' + oi + '">' + esc(q.choices[oi]) + '</button>'; }).join('') + '</div>';
      $body.innerHTML = h;
      $body.querySelectorAll('.choice').forEach(function (b) {
        b.onclick = function () {
          if (ui.locked) return;
          $body.querySelectorAll('.choice').forEach(function (x) { x.classList.remove('sel'); });
          b.classList.add('sel'); ui.response = +b.getAttribute('data-i'); setReady(true);
        };
      });
    } else if (q.type === 'fill' || q.type === 'verbform') {
      h += '<div class="q-prompt">' + blankify(q.prompt) + '</div>' +
        '<input class="text-answer" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Ketik jawaban untuk bagian kosong" aria-label="Jawaban">' +
        (q.type === 'verbform' ? '<p class="hint">Ketik hanya kata yang mengisi bagian kosong, dalam bentuk yang benar.</p>' : '');
      $body.innerHTML = h;
      var inp = $body.querySelector('input');
      inp.oninput = function () { ui.response = inp.value; setReady(inp.value.trim().length > 0); };
      inp.onkeydown = function (e) { if (e.key === 'Enter' && inp.value.trim()) { e.preventDefault(); ui.submit && ui.submit(); } };
      ui.focus = function () { inp.focus(); };
    } else if (q.type === 'translate') {
      h += '<div class="q-source">' + esc(q.source) + '</div>' +
        '<textarea class="text-answer" autocomplete="off" autocapitalize="sentences" autocorrect="off" spellcheck="false" placeholder="Tulis dalam bahasa Inggris" aria-label="Terjemahan"></textarea>' +
        (q.prompt ? '<p class="hint">' + esc(q.prompt) + '</p>' : '');
      $body.innerHTML = h;
      var ta = $body.querySelector('textarea');
      ta.oninput = function () { ui.response = ta.value; setReady(ta.value.trim().length > 0); };
      ui.focus = function () { ta.focus(); };
    } else if (q.type === 'correct') {
      h += '<p class="muted small-text">Ubah bagian yang salah, lalu Periksa. Jika kalimatnya sudah benar, ketuk “Sudah benar”.</p>' +
        '<div class="q-source">' + esc(q.prompt) + '</div>' +
        '<textarea class="text-answer" autocomplete="off" autocapitalize="sentences" autocorrect="off" spellcheck="false" aria-label="Kalimat yang benar">' + esc(q.prompt) + '</textarea>' +
        '<div class="row"><button type="button" class="btn secondary" data-act="isok">Sudah benar</button></div>';
      $body.innerHTML = h;
      var t2 = $body.querySelector('textarea');
      ui.response = { text: t2.value };
      t2.oninput = function () { ui.response = { text: t2.value }; setReady(G.basic(t2.value) !== G.basic(q.prompt) && t2.value.trim().length > 0); };
      $body.querySelector('[data-act=isok]').onclick = function () { if (ui.locked) return; ui.response = { ok: true }; ui.submit && ui.submit(); };
    } else if (q.type === 'order') {
      ui.bankOrder = shuffledIndexes(q.tokens.length, true);
      ui.picked = [];
      h += '<div class="q-prompt">' + esc(q.prompt) + '</div><div class="answer-line" aria-label="Kalimat Anda"></div><div class="bank"></div>';
      $body.innerHTML = h;
      var $line = $body.querySelector('.answer-line'), $bank = $body.querySelector('.bank');
      var drawOrder = function () {
        $line.innerHTML = ui.picked.map(function (ti, k) { return '<button type="button" class="chip" data-k="' + k + '">' + esc(q.tokens[ti]) + '</button>'; }).join('');
        $bank.innerHTML = ui.bankOrder.map(function (ti) { return '<button type="button" class="chip' + (ui.picked.indexOf(ti) >= 0 ? ' used' : '') + '" data-t="' + ti + '">' + esc(q.tokens[ti]) + '</button>'; }).join('');
        $line.querySelectorAll('.chip').forEach(function (b) { b.onclick = function () { if (ui.locked) return; ui.picked.splice(+b.getAttribute('data-k'), 1); drawOrder(); }; });
        $bank.querySelectorAll('.chip').forEach(function (b) { b.onclick = function () { if (ui.locked) return; var ti = +b.getAttribute('data-t'); if (ui.picked.indexOf(ti) < 0) { ui.picked.push(ti); drawOrder(); } }; });
        ui.response = ui.picked.map(function (ti) { return q.tokens[ti]; });
        setReady(ui.picked.length === q.tokens.length);
      };
      drawOrder();
    } else if (q.type === 'match') {
      ui.rightOrder = shuffledIndexes(q.pairs.length, true);
      ui.map = q.pairs.map(function () { return null; }); // kiri i -> index kanan asli
      ui.sel = null;
      h += '<div class="q-prompt">' + esc(q.prompt || 'Jodohkan kiri dan kanan.') + '</div><p class="hint" style="margin-top:-8px">Ketuk satu di kiri, lalu pasangannya di kanan.</p><div class="match"><div class="col" data-col="l"></div><div class="col" data-col="r"></div></div>';
      $body.innerHTML = h;
      var $l = $body.querySelector('[data-col=l]'), $r = $body.querySelector('[data-col=r]');
      var drawMatch = function () {
        $l.innerHTML = q.pairs.map(function (p, i) {
          return '<button type="button" class="m-item' + (ui.sel === i ? ' sel' : '') + (ui.map[i] != null ? ' paired' : '') + '" data-l="' + i + '"><span class="tag">' + (i + 1) + '</span>' + esc(p[0]) + '</button>';
        }).join('');
        $r.innerHTML = ui.rightOrder.map(function (ri) {
          var owner = ui.map.indexOf(ri);
          return '<button type="button" class="m-item' + (owner >= 0 ? ' paired' : '') + '" data-r="' + ri + '">' + (owner >= 0 ? '<span class="tag">' + (owner + 1) + '</span>' : '') + esc(q.pairs[ri][1]) + '</button>';
        }).join('');
        $l.querySelectorAll('[data-l]').forEach(function (b) {
          b.onclick = function () { if (ui.locked) return; var i = +b.getAttribute('data-l'); if (ui.map[i] != null) ui.map[i] = null; ui.sel = i; drawMatch(); };
        });
        $r.querySelectorAll('[data-r]').forEach(function (b) {
          b.onclick = function () {
            if (ui.locked) return;
            var ri = +b.getAttribute('data-r');
            var owner = ui.map.indexOf(ri);
            if (ui.sel == null) { if (owner >= 0) { ui.map[owner] = null; drawMatch(); } return; }
            if (owner >= 0) ui.map[owner] = null;
            ui.map[ui.sel] = ri;
            var nextFree = ui.map.indexOf(null);
            ui.sel = nextFree >= 0 ? nextFree : null;
            drawMatch();
          };
        });
        ui.response = ui.map.slice();
        setReady(ui.map.indexOf(null) < 0);
      };
      ui.sel = 0;
      drawMatch();
    }
    return ui;
  }

  function showFeedback(q, ok, response, $container, onNext) {
    var yours = '';
    if (!ok) {
      if (q.type === 'choice' && response != null) yours = q.choices[response];
      else if (q.type === 'order') yours = (response || []).join(' ');
      else if (q.type === 'correct') yours = response && response.ok ? 'Sudah benar' : (response && response.text) || '';
      else if (q.type !== 'match') yours = response || '';
    }
    var ans = G.answerText(q);
    var sayable = q.type !== 'match' && !(q.type === 'correct' && q.isCorrect) && q.type !== 'choice' && q.type !== 'fill' && q.type !== 'verbform';
    var sayText = q.type === 'correct' && q.isCorrect ? q.prompt : ans;
    var fb = document.createElement('div');
    fb.className = 'feedback ' + (ok ? 'ok' : 'bad');
    fb.innerHTML = '<div class="head">' + (ok ? 'Benar!' : 'Belum tepat') + '</div>' +
      (!ok || q.type === 'match' || q.type === 'translate' ? '<div class="lbl">Jawaban benar</div><div class="ans"><span>' + esc(ans) + '</span>' + (sayable ? speakBtn(sayText) : '') + '</div>' : '') +
      (yours ? '<div class="lbl">Jawaban Anda</div><div class="yours">' + esc(yours) + '</div>' : '') +
      '<div class="why">' + esc(q.why) + '</div>' +
      '<div class="ref">Unit ' + q.ref + ' · English Grammar in Use' + (q.doubt ? ' · [ragu]' : '') + '</div>' +
      '<button type="button" class="btn" data-act="cont">Lanjut</button>';
    $container.appendChild(fb);
    var btn = fb.querySelector('[data-act=cont]');
    btn.onclick = onNext;
    setTimeout(function () { btn.focus({ preventScroll: true }); fb.scrollIntoView && fb.scrollIntoView({ block: 'end' }); }, 30);
  }

  function markChoices($body, q, response, ok) {
    if (q.type === 'choice') {
      $body.querySelectorAll('.choice').forEach(function (b) {
        var i = +b.getAttribute('data-i');
        if (i === q.correct) b.classList.add('right');
        else if (i === response && !ok) b.classList.add('wrong');
      });
    }
    if (q.type === 'match') {
      $body.querySelectorAll('[data-l]').forEach(function (b) {
        var i = +b.getAttribute('data-l');
        b.classList.add(response[i] === i ? 'right' : 'wrong');
      });
    }
    $body.querySelectorAll('input, textarea').forEach(function (x) { x.readOnly = true; });
  }

  function renderQuestion() {
    var s = session;
    if (s.idx >= s.queue.length) return finishLesson();
    var item = s.queue[s.idx], q = item.q;
    var done = Math.min(s.idx, s.queue.length);
    $app.innerHTML = '<div class="screen">' + lessonTop(done / s.queue.length) +
      '<div class="screen-body">' + (item.retry ? '<p class="badge" style="display:inline-block">Ulangi soal yang tadi salah</p>' : '') + '<div data-q></div></div>' +
      '<div class="action-bar" data-bar><button type="button" class="btn" data-act="check" disabled>Periksa</button></div></div>';
    bindExit();
    var $body = $app.querySelector('[data-q]'), $check = $app.querySelector('[data-act=check]');
    var ui = questionUI(q, $body, function (r) { $check.disabled = !r; });
    var submit = function () {
      if (ui.locked) return;
      ui.locked = true;
      var ok = G.grade(q, ui.response);
      markChoices($body, q, ui.response, ok);
      if (!item.retry) {
        if (ok) { s.firstOk++; s.xp += 2; addXP(2); }
        else { s.mistakes.push({ q: q, response: ui.response }); scheduleWrong(q); }
        if (!ok && !s.retried[q.id]) { s.retried[q.id] = true; s.queue.push({ q: q, retry: true }); }
        save();
      }
      var bar = $app.querySelector('[data-bar]'); bar.remove();
      showFeedback(q, ok, ui.response, $app.querySelector('.screen'), function () { s.idx++; renderQuestion(); });
    };
    ui.submit = submit;
    $check.onclick = submit;
    if (ui.focus) setTimeout(ui.focus, 50);
  }

  function finishLesson() {
    var s = session, n = s.unit.unit;
    var score = s.firstOk / s.total;
    var st = starsFor(score);
    var up = P.units[n] || {};
    var wasDone = (up.stars || 0) >= 1;
    up.bestScore = Math.max(up.bestScore || 0, score);
    up.stars = Math.max(up.stars || 0, st);
    up.attempts = (up.attempts || 0) + 1;
    up.lastDate = todayStr();
    up.unlocked = true;
    P.units[n] = up;
    s.xp += 5; addXP(5);
    markActivity();
    save();
    var av = availableUnits(), next = av[av.indexOf(n) + 1];
    var unlockedNext = !wasDone && up.stars >= 1 && next;
    var html = '<div class="screen"><div class="screen-body"><div class="result-hero">' +
      '<div class="big-stars" aria-label="' + st + ' bintang">' + [0, 1, 2].map(function (i) { return '<span class="' + (i < st ? '' : 'off') + '">★</span>'; }).join('') + '</div>' +
      '<h1>' + (st === 3 ? 'Sempurna!' : st >= 1 ? 'Pelajaran selesai!' : 'Pelajaran selesai, coba lagi ya') + '</h1>' +
      '<p class="muted">Unit ' + n + ' · ' + esc(s.unit.titleId || s.unit.title) + '</p></div>' +
      '<div class="result-grid"><div class="cell"><b>' + Math.round(score * 100) + '%</b><span>skor</span></div>' +
      '<div class="cell"><b>+' + s.xp + '</b><span>XP</span></div>' +
      '<div class="cell"><b>' + streakNow() + '</b><span>hari streak</span></div></div>' +
      '<p class="center small-text">Target hari ini: ' + Math.min(todayXP(), P.dailyGoal) + '/' + P.dailyGoal + ' XP' + (todayXP() >= P.dailyGoal ? ' ✔ tercapai' : '') + '</p>';
    if (st === 0) html += '<div class="card small-text">Butuh minimal 60% (1 bintang) untuk membuka unit berikutnya. Tidak ada batas mengulang.</div>';
    if (unlockedNext) html += '<div class="card small-text">Unit ' + next + ' sekarang terbuka.</div>';
    if (s.mistakes.length) {
      html += '<h2>Soal yang salah</h2><p class="muted small-text">Soal ini akan muncul lagi di Ulasan mulai besok.</p>';
      s.mistakes.forEach(function (m) {
        var q = m.q;
        html += '<div class="mistake"><div>' + esc(q.type === 'translate' ? q.source : q.prompt || 'Jodohkan') + '</div><div class="a">' + esc(G.answerText(q)) + '</div></div>';
      });
    }
    html += '</div><div class="action-bar">' +
      (st >= 1 && next ? '<button type="button" class="btn" data-act="next">Lanjut ke Unit ' + next + '</button>' : '') +
      '<button type="button" class="btn ' + (st >= 1 && next ? 'secondary' : '') + '" data-act="again">Ulangi pelajaran</button>' +
      '<button type="button" class="btn ghost" data-act="home">Ke peta jalur</button></div></div>';
    $app.innerHTML = html;
    window.scrollTo(0, 0);
    var nb = $app.querySelector('[data-act=next]'); if (nb) nb.onclick = function () { go('#/unit/' + next); };
    $app.querySelector('[data-act=again]').onclick = function () { startLesson(n); };
    $app.querySelector('[data-act=home]').onclick = function () { go('#/'); };
  }

  // ------------------------------------------------------------ layar: ulasan kesalahan
  function startReview() {
    var ids = dueReviewIds().slice(0, REVIEW_MAX);
    if (!ids.length) { toast('Tidak ada soal ulasan untuk hari ini.'); return go('#/'); }
    var units = {};
    ids.forEach(function (id) { var u = P.review[id].unit || parseInt(id.slice(1, 4), 10); units[u] = true; });
    Promise.all(Object.keys(units).map(function (u) { return loadUnit(+u).catch(function () { return null; }); })).then(function (list) {
      var byId = {};
      list.forEach(function (u) { if (u) u.lessons.forEach(function (l) { l.questions.forEach(function (q) { byId[q.id] = q; }); }); });
      var qs = [];
      ids.forEach(function (id) { if (byId[id]) qs.push(byId[id]); else delete P.review[id]; });
      save();
      if (!qs.length) { toast('Tidak ada soal ulasan untuk hari ini.'); return go('#/'); }
      session = { kind: 'review', qs: shuffle(qs), idx: 0, ok: 0, xp: 0 };
      renderReviewQ();
    });
  }
  function renderReviewQ() {
    var s = session;
    if (s.idx >= s.qs.length) return finishReview();
    var q = s.qs[s.idx];
    $app.innerHTML = '<div class="screen">' + lessonTop(s.idx / s.qs.length) +
      '<div class="screen-body"><p class="badge" style="display:inline-block">Ulasan · Unit ' + q.ref + '</p><div data-q></div></div>' +
      '<div class="action-bar" data-bar><button type="button" class="btn" data-act="check" disabled>Periksa</button></div></div>';
    bindExit();
    var $body = $app.querySelector('[data-q]'), $check = $app.querySelector('[data-act=check]');
    var ui = questionUI(q, $body, function (r) { $check.disabled = !r; });
    ui.submit = function () {
      if (ui.locked) return;
      ui.locked = true;
      var ok = G.grade(q, ui.response);
      markChoices($body, q, ui.response, ok);
      reviewResult(q.id, ok);
      if (ok) { s.ok++; s.xp += 1; addXP(1); }
      save();
      $app.querySelector('[data-bar]').remove();
      showFeedback(q, ok, ui.response, $app.querySelector('.screen'), function () { s.idx++; renderReviewQ(); });
    };
    $check.onclick = ui.submit;
    if (ui.focus) setTimeout(ui.focus, 50);
  }
  function finishReview() {
    var s = session;
    markActivity(); save();
    var left = dueReviewIds().length;
    $app.innerHTML = '<div class="screen"><div class="screen-body"><div class="result-hero"><div style="font-size:54px" aria-hidden="true">🔁</div>' +
      '<h1>Ulasan selesai</h1><p class="muted">Benar ' + s.ok + ' dari ' + s.qs.length + ' soal.</p></div>' +
      '<div class="result-grid"><div class="cell"><b>+' + s.xp + '</b><span>XP</span></div><div class="cell"><b>' + streakNow() + '</b><span>hari streak</span></div><div class="cell"><b>' + left + '</b><span>sisa hari ini</span></div></div>' +
      '<p class="muted small-text">Soal yang benar dijadwalkan lagi dengan jarak makin panjang (3, 7, lalu 14 hari). Soal yang salah muncul lagi besok.</p></div>' +
      '<div class="action-bar">' + (left ? '<button type="button" class="btn" data-act="more">Ulasan berikutnya (' + left + ')</button>' : '') +
      '<button type="button" class="btn ' + (left ? 'secondary' : '') + '" data-act="home">Ke peta jalur</button></div></div>';
    var m = $app.querySelector('[data-act=more]'); if (m) m.onclick = function () { startReview(); };
    $app.querySelector('[data-act=home]').onclick = function () { go('#/'); };
  }

  // ------------------------------------------------------------ layar: pengaturan
  function renderSettings() {
    var av = availableUnits();
    var html = '<div class="screen"><div class="topbar"><button type="button" class="icon-btn" data-act="back" aria-label="Kembali">' + ICON.back + '</button><div class="title">Pengaturan</div></div><div class="screen-body">' +
      '<div class="setting"><h3>Target harian</h3><p class="muted small-text">Satu pelajaran memberi sampai 25 XP.</p><div class="seg" data-goal>' +
      GOALS.map(function (g) { return '<button type="button" data-g="' + g + '" class="' + (P.dailyGoal === g ? 'on' : '') + '">' + g + ' XP</button>'; }).join('') + '</div></div>' +
      '<div class="setting"><h3>Suara</h3><p class="small-text" data-tts-status></p><div class="seg" data-voice>' +
      '<button type="button" data-v="en-GB" class="' + (P.settings.voice === 'en-GB' ? 'on' : '') + '">British</button>' +
      '<button type="button" data-v="en-US" class="' + (P.settings.voice === 'en-US' ? 'on' : '') + '">Amerika</button></div>' +
      '<label class="small-text" for="rate" style="display:block;margin-top:10px">Kecepatan: <b data-rate-val>' + P.settings.rate.toFixed(1) + '×</b></label>' +
      '<input id="rate" type="range" min="0.6" max="1.2" step="0.1" value="' + P.settings.rate + '">' +
      '<div class="row"><button type="button" class="btn secondary" data-act="testvoice">Uji suara</button></div></div>' +
      '<div class="setting"><h3>Cadangan progres</h3><p class="small-text">Progres hanya tersimpan di Chrome HP ini. <b>Jika data Chrome dihapus atau aplikasi di-uninstall, progres hilang.</b> Simpan cadangan sesekali.</p>' +
      '<div class="row"><button type="button" class="btn secondary" data-act="export">Ekspor</button><button type="button" class="btn secondary" data-act="import">Impor</button></div>' +
      '<input type="file" accept="application/json,.json" data-file hidden></div>' +
      '<div class="setting"><h3>Tes penempatan</h3><p class="small-text muted">' + (P.placement.done ? 'Terakhir: ' + esc(P.placement.date) + ', benar ' + esc(P.placement.score) + ', rekomendasi Unit ' + P.placement.recommendedUnit + '.' : 'Belum dikerjakan.') + '</p>' +
      '<div class="row"><button type="button" class="btn secondary" data-act="placement">' + (P.placement.done ? 'Ulangi tes' : 'Mulai tes') + '</button></div></div>' +
      '<div class="setting"><h3>Offline dan pemasangan</h3><p class="small-text" data-offline>Memeriksa…</p>' +
      '<p class="small-text muted">Pasang ke layar utama: menu titik tiga di Chrome, lalu “Instal aplikasi” atau “Tambahkan ke layar utama”.</p>' +
      '<p class="small-text muted">Penyimpanan permanen: ' + (P.persisted === true ? 'aktif' : P.persisted === false ? 'tidak diizinkan oleh Chrome (data bisa terhapus jika memori HP penuh)' : 'belum diketahui') + '.</p></div>' +
      '<div class="setting"><h3>Materi</h3><p class="small-text">Unit ' + av[0] + '–' + av[av.length - 1] + ' tersedia (' + av.length + ' dari 145 unit). Versi materi ' + esc(INDEX.contentVersion) + ', aplikasi ' + APP_VERSION + '.</p>' +
      '<p class="small-text muted">Kurikulum: English Grammar in Use, Fifth Edition (Raymond Murphy, Cambridge University Press). Penjelasan dan soal ditulis ulang, bukan salinan buku.</p></div>' +
      '<div class="setting"><h3>Hapus semua progres</h3><p class="small-text muted">XP, streak, bintang, dan ulasan akan kembali ke nol.</p><div class="row"><button type="button" class="btn danger" data-act="reset">Hapus semua progres</button></div></div>' +
      '</div></div>';
    $app.innerHTML = html;
    $app.querySelector('[data-act=back]').onclick = function () { go('#/'); };
    $app.querySelectorAll('[data-g]').forEach(function (b) { b.onclick = function () { P.dailyGoal = +b.getAttribute('data-g'); save(); renderSettings(); }; });
    $app.querySelectorAll('[data-v]').forEach(function (b) { b.onclick = function () { P.settings.voice = b.getAttribute('data-v'); save(); pickVoice(); renderSettings(); }; });
    var rate = $app.querySelector('#rate');
    rate.oninput = function () { P.settings.rate = +rate.value; $app.querySelector('[data-rate-val]').textContent = P.settings.rate.toFixed(1) + '×'; };
    rate.onchange = function () { save(); };
    var ts = $app.querySelector('[data-tts-status]');
    ts.innerHTML = tts.ok ? '<span class="status-ok">Suara tersedia:</span> ' + esc(tts.voice.name) + ' (' + esc(tts.voice.lang) + ')' :
      '<span class="status-warn">Suara bahasa Inggris tidak ditemukan.</span> Tombol dengar disembunyikan. Pasang paket suara Inggris di Setelan Android → Text-to-speech.';
    $app.querySelector('[data-act=testvoice]').onclick = function () { if (tts.ok) speak('Hello! I am practising English grammar every day.'); else toast('Suara bahasa Inggris tidak tersedia di HP ini.'); };
    $app.querySelector('[data-act=export]').onclick = exportProgress;
    var $file = $app.querySelector('[data-file]');
    $app.querySelector('[data-act=import]').onclick = function () { $file.click(); };
    $file.onchange = function () { if ($file.files[0]) importProgress($file.files[0]); $file.value = ''; };
    $app.querySelector('[data-act=placement]').onclick = function () { go('#/placement'); };
    $app.querySelector('[data-act=reset]').onclick = function () {
      dialog({
        title: 'Hapus semua progres?', text: 'Semua XP, streak, bintang, dan ulasan akan hilang dari HP ini.', ok: 'Lanjut', danger: true,
        onOk: function () {
          dialog({
            title: 'Yakin? Ini tidak bisa dibatalkan.', text: 'Saran: ekspor cadangan dulu jika ingin menyimpannya.', ok: 'Ya, hapus semua', danger: true,
            onOk: function () { P = defaultProgress(); save(); toast('Progres sudah dihapus.'); go('#/'); }
          });
        }
      });
    };
    offlineStatus($app.querySelector('[data-offline]'));
  }
  function offlineStatus(el) {
    if (!('serviceWorker' in navigator) || !window.caches) { el.innerHTML = '<span class="status-warn">Browser ini tidak mendukung mode offline.</span>'; return; }
    caches.keys().then(function (keys) {
      var k = keys.filter(function (x) { return /^cays-english-/.test(x); }).sort().pop();
      if (!k) { el.innerHTML = '<span class="status-warn">Belum siap offline.</span> Buka aplikasi saat online dan tunggu sebentar.'; return; }
      return caches.open(k).then(function (c) { return c.keys(); }).then(function (reqs) {
        var units = reqs.filter(function (r) { return /content\/units\//.test(r.url); }).length;
        var need = availableUnits().length;
        el.innerHTML = units >= need && navigator.serviceWorker.controller ?
          '<span class="status-ok">Siap dipakai offline.</span> ' + units + ' unit tersimpan di HP.' :
          '<span class="status-warn">Sedang menyiapkan offline…</span> ' + units + '/' + need + ' unit tersimpan. Tutup lalu buka lagi aplikasi saat online.';
      });
    }).catch(function () { el.textContent = 'Status offline tidak bisa diperiksa.'; });
  }
  function exportProgress() {
    try {
      var blob = new Blob([JSON.stringify(P, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'cays-english-cadangan-' + todayStr() + '.json';
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      toast('File cadangan disimpan ke folder Download.');
    } catch (e) { toast('Ekspor gagal.'); }
  }
  function importProgress(file) {
    var r = new FileReader();
    r.onload = function () {
      var data;
      try { data = JSON.parse(r.result); } catch (e) { return toast('File tidak bisa dibaca. Pilih file cadangan Cay\'s English (.json).'); }
      if (!isValidBackup(data)) return toast('Ini bukan file cadangan Cay\'s English yang valid.');
      dialog({
        title: 'Ganti progres dengan cadangan ini?', text: 'Cadangan: ' + data.xp + ' XP, ' + Object.keys(data.units).length + ' unit dikerjakan. Progres saat ini akan diganti.', ok: 'Ganti',
        onOk: function () { P = merge(defaultProgress(), data); save(); toast('Progres berhasil dipulihkan.'); go('#/'); }
      });
    };
    r.readAsText(file);
  }

  function loadError(err) {
    $app.innerHTML = '<div class="screen"><div class="screen-body"><h1>Materi gagal dimuat</h1><p>Periksa koneksi internet, lalu coba lagi. Setelah aplikasi pernah dibuka saat online, materi tersedia offline.</p><p class="muted small-text">' + esc(err && err.message) + '</p></div>' +
      '<div class="action-bar"><button type="button" class="btn" data-act="retry">Coba lagi</button></div></div>';
    $app.querySelector('[data-act=retry]').onclick = function () { location.reload(); };
  }

  // ------------------------------------------------------------ service worker, penyimpanan permanen
  function setupSW() {
    if (!('serviceWorker' in navigator)) return;
    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () { if (refreshing) return; refreshing = true; location.reload(); });
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      function offer(w) {
        toast('Versi baru tersedia.', 'Muat ulang', function () { w.postMessage('skipWaiting'); });
      }
      if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
      reg.addEventListener('updatefound', function () {
        var w = reg.installing;
        if (!w) return;
        w.addEventListener('statechange', function () {
          if (w.state === 'installed' && navigator.serviceWorker.controller) offer(w);
        });
      });
    }).catch(function () { /* offline tidak tersedia */ });
  }
  function requestPersist() {
    if (P.persisted === true || !navigator.storage || !navigator.storage.persist) return;
    navigator.storage.persisted().then(function (already) {
      if (already) return true;
      return navigator.storage.persist();
    }).then(function (ok) { P.persisted = !!ok; save(); }).catch(function () {});
  }

  // ------------------------------------------------------------ mulai
  getJSON('content/index.json').then(function (idx) {
    INDEX = idx;
    window.addEventListener('hashchange', route);
    route();
    if (!storageOk) toast('Penyimpanan HP tidak tersedia. Progres tidak akan tersimpan.', null, null, 6000);
    requestPersist();
  }).catch(loadError);
  setupSW();

  // Untuk pengujian otomatis.
  window.__cays = { get progress() { return P; }, todayStr: todayStr, addDays: addDays };
})();
