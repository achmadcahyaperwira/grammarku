/* Cay's English - penilaian jawaban.
 * Dipakai oleh aplikasi (browser) dan skrip pemeriksa (Node).
 */
(function (root) {
  'use strict';

  // Kontraksi yang tidak ambigu: selalu diubah ke bentuk panjang.
  var FIXED = [
    [/\bwon't\b/g, 'will not'],
    [/\bcan't\b/g, 'cannot'],
    [/\bshan't\b/g, 'shall not'],
    [/\bain't\b/g, 'is not'],
    [/n't\b/g, ' not'],
    [/'m\b/g, ' am'],
    [/'re\b/g, ' are'],
    [/'ve\b/g, ' have'],
    [/'ll\b/g, ' will']
  ];

  // Kata ganti/kata tanya yang bisa diikuti 's (= is / has) atau 'd (= had / would).
  var S_HOSTS = ['he', 'she', 'it', 'there', 'that', 'what', 'who', 'where', 'here', 'how', 'when', 'why',
    'everything', 'nothing', 'something', 'everybody', 'everyone', 'somebody', 'someone', 'nobody', 'this'];
  var D_HOSTS = ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'there', 'who', 'that'];

  // Kata setelah 's yang menandakan 's = has (bukan is).
  var HAS_NEXT = ['got', 'been', 'just', 'already', 'never', 'ever', 'always', 'not', 'recently', 'also', 'still', 'only',
    'gone', 'done', 'made', 'had', 'lost', 'seen', 'written', 'broken', 'taken', 'given', 'eaten', 'left', 'found',
    'known', 'read', 'met', 'bought', 'brought', 'thought', 'taught', 'caught', 'put', 'cut', 'hit', 'let', 'set',
    'come', 'become', 'run', 'sung', 'drunk', 'swum', 'begun', 'flown', 'grown', 'shown', 'spent', 'sent', 'won',
    'told', 'sold', 'said', 'heard', 'felt', 'kept', 'slept', 'built', 'understood', 'forgotten', 'chosen', 'driven',
    'ridden', 'spoken', 'stolen', 'woken', 'worn', 'torn', 'thrown', 'drawn', 'fallen', 'shut', 'spilt', 'burnt',
    'learnt', 'dreamt', 'stood', 'held', 'paid', 'laid', 'lent', 'meant', 'fought', 'hidden', 'bitten', 'beaten'];

  function basic(s) {
    s = String(s == null ? '' : s);
    s = s.replace(/[‘’ʼ`´]/g, "'").replace(/[“”]/g, '"');
    s = s.toLowerCase();
    s = s.replace(/[.,!?;:"()…–—]/g, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    for (var i = 0; i < FIXED.length; i++) s = s.replace(FIXED[i][0], FIXED[i][1]);
    return s.replace(/\s+/g, ' ').trim();
  }

  function isParticipleLike(w) {
    if (!w) return false;
    if (HAS_NEXT.indexOf(w) >= 0) return true;
    return /ed$/.test(w);
  }

  // Semua kemungkinan bentuk panjang dari jawaban pengguna (untuk 's dan 'd yang ambigu).
  function candidates(s) {
    var words = basic(s).split(' ');
    var options = [[]];
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      var alts = [w];
      var m = /^(.+)'s$/.exec(w);
      var d = /^(.+)'d$/.exec(w);
      if (m && S_HOSTS.indexOf(m[1]) >= 0) {
        alts = [m[1] + ' is'];
        if (isParticipleLike(words[i + 1])) alts.push(m[1] + ' has');
        alts.push(w);
      } else if (d && D_HOSTS.indexOf(d[1]) >= 0) {
        alts = [d[1] + ' had', d[1] + ' would', w];
      }
      var next = [];
      for (var a = 0; a < options.length; a++) {
        for (var b = 0; b < alts.length; b++) {
          if (next.length < 64) next.push(options[a].concat([alts[b]]));
        }
      }
      options = next;
    }
    return options.map(function (ws) { return ws.join(' ').replace(/\s+/g, ' ').trim(); });
  }

  function keys(q) {
    var list = [];
    if (q.answer != null) list.push(q.answer);
    (q.accept || []).forEach(function (a) { list.push(a); });
    return list.map(basic);
  }

  function textMatches(q, response) {
    var ks = keys(q);
    var cs = candidates(response);
    for (var i = 0; i < cs.length; i++) if (ks.indexOf(cs[i]) >= 0) return true;
    return false;
  }

  /* response:
   *  choice   -> nomor pilihan (index)
   *  fill / verbform / translate -> teks
   *  correct  -> { ok: true } (ketuk "Sudah benar") atau { text: '...' }
   *  order    -> array token sesuai urutan yang dipilih
   *  match    -> array index kanan untuk setiap baris kiri (urutan asli pairs)
   */
  function grade(q, response) {
    switch (q.type) {
      case 'choice':
        return response === q.correct;
      case 'fill':
      case 'verbform':
      case 'translate':
        return textMatches(q, response);
      case 'correct':
        if (response && response.ok) return !!q.isCorrect;
        if (q.isCorrect) return basic(response && response.text) === basic(q.prompt) || textMatches(q, response && response.text);
        return textMatches(q, response && response.text);
      case 'order':
        return Array.isArray(response) && textMatches(q, response.join(' '));
      case 'match':
        if (!Array.isArray(response) || response.length !== q.pairs.length) return false;
        for (var i = 0; i < response.length; i++) if (response[i] !== i) return false;
        return true;
      default:
        return false;
    }
  }

  // Teks jawaban benar untuk ditampilkan.
  function answerText(q) {
    switch (q.type) {
      case 'choice': return q.choices[q.correct];
      case 'match': return q.pairs.map(function (p) { return p[0] + ' → ' + p[1]; }).join('\n');
      case 'correct': return q.isCorrect ? 'Kalimat ini sudah benar.' : q.answer;
      default: return q.answer;
    }
  }

  var api = { basic: basic, candidates: candidates, grade: grade, answerText: answerText, textMatches: textMatches };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Grading = api;
})(this);
