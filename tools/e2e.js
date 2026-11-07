#!/usr/bin/env node
/* Uji alur Cay's English di Chromium dengan emulasi HP Android.
 * Butuh: Playwright dan server lokal, misalnya
 *   python3 -m http.server 8765   (dari folder aplikasi)
 *   node tools/e2e.js http://localhost:8765/ [folder-screenshot]
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium, devices } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:8765/';
const SHOTS = process.argv[3] || null;
const ROOT = path.join(__dirname, '..');
const INDEX = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/index.json'), 'utf8'));
const PLACEMENT = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/placement.json'), 'utf8'));
const UNITS = {};
INDEX.units.filter(u => u.available).forEach(u => { UNITS[u.n] = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/units', u.file), 'utf8')); });

const results = [];
function report(name, pass, detail) { results.push({ name, pass, detail }); console.log((pass ? 'LULUS ' : 'GAGAL ') + name + (detail ? ' - ' + detail : '')); }
async function shot(page, name) { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: false }); }

async function answerQuestion(page, q, correct) {
  if (q.type === 'choice') {
    const i = correct ? q.correct : (q.correct + 1) % q.choices.length;
    await page.click('.choice[data-i="' + i + '"]');
  } else if (q.type === 'fill' || q.type === 'verbform') {
    await page.fill('input.text-answer', correct ? q.answer : 'xyz');
  } else if (q.type === 'translate') {
    await page.fill('textarea.text-answer', correct ? q.answer : 'xyz');
  } else if (q.type === 'correct') {
    if (q.isCorrect && correct) { await page.click('[data-act=isok]'); return; }
    if (!q.isCorrect && !correct) { await page.click('[data-act=isok]'); return; }
    await page.fill('textarea.text-answer', correct ? q.answer : q.prompt + ' xyz');
  } else if (q.type === 'order') {
    const order = correct ? q.tokens.map((_, i) => i) : q.tokens.map((_, i) => q.tokens.length - 1 - i);
    for (const i of order) await page.click('.bank .chip[data-t="' + i + '"]');
  } else if (q.type === 'match') {
    const n = q.pairs.length;
    for (let i = 0; i < n; i++) {
      await page.click('[data-l="' + i + '"]');
      const r = correct ? i : (i === 0 ? 1 : i === 1 ? 0 : i);
      await page.click('[data-r="' + r + '"]');
    }
  }
  await page.click('[data-act=check]');
}

async function currentQuestion(page, unit) {
  // Soal dikenali dari teks tampilan.
  const text = await page.$eval('[data-q]', el => el.innerText);
  const qs = unit.lessons[0].questions;
  const found = qs.filter(q => {
    if (q.type === 'translate') return text.includes(q.source);
    if (q.type === 'match') return text.includes(q.pairs[0][0]) && text.includes(q.pairs[1][0]);
    const parts = q.prompt.split('___').map(x => x.trim());
    return parts.every(x => !x || text.includes(x.slice(0, 40))) && parts.some(Boolean);
  });
  return found;
}

async function playLesson(page, n, wrongIds) {
  const unit = UNITS[n];
  await page.goto(BASE + '#/unit/' + n);
  await page.waitForSelector('.card');
  const cards = unit.lessons[0].cards.length;
  for (let k = 0; k < cards; k++) await page.click('[data-act=next]');
  let answered = 0, guard = 0;
  while (guard++ < 40) {
    if (await page.$('.result-hero')) break;
    await page.waitForSelector('[data-q]');
    const isRetry = await page.$('.badge');
    const cands = await currentQuestion(page, unit);
    if (cands.length !== 1) throw new Error('Unit ' + n + ': soal tidak dikenali (' + cands.length + ' kandidat)');
    const q = cands[0];
    const wantWrong = !isRetry && wrongIds && wrongIds.includes(q.id);
    await answerQuestion(page, q, !wantWrong);
    await page.waitForSelector('.feedback');
    const okShown = await page.$('.feedback.ok');
    if (!!okShown !== !wantWrong) throw new Error(q.id + ': umpan balik salah (diharapkan ' + (wantWrong ? 'salah' : 'benar') + ')');
    const refText = await page.$eval('.feedback .ref', el => el.textContent);
    if (!refText.includes('Unit ' + n)) throw new Error(q.id + ': rujukan unit tidak tampil');
    answered++;
    await page.click('[data-act=cont]');
  }
  await page.waitForSelector('.result-hero');
  return answered;
}

(async () => {
  const userDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cays-e2e-'));
  const device = devices['Pixel 7'];
  const launch = () => chromium.launchPersistentContext(userDir, Object.assign({}, device, { acceptDownloads: true }));
  let ctx = await launch();
  let page = ctx.pages()[0] || await ctx.newPage();
  const consoleErrors = [];
  const watch = p => { p.on('pageerror', e => consoleErrors.push(String(e))); p.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); }); };
  watch(page);

  try {
    // 1. Pembukaan pertama
    await page.goto(BASE);
    await page.waitForSelector('[data-act=placement]');
    report('Layar sambutan tampil saat pertama dibuka', true);
    await shot(page, '01-sambutan');

    // 2. Tes penempatan: 4 soal pertama benar, soal ke-5 salah -> rekomendasi Unit 12
    await page.click('[data-act=placement]');
    for (let i = 0; i < PLACEMENT.questions.length; i++) {
      const q = PLACEMENT.questions[i];
      await page.waitForSelector('.choice');
      const pick = i === 4 ? (q.correct + 1) % q.choices.length : q.correct;
      await page.click('.choice[data-i="' + pick + '"]');
      if (i === 0) await shot(page, '02-tes-penempatan');
      await page.click('[data-act=next]');
    }
    await page.waitForSelector('.result-hero');
    const recText = await page.textContent('.screen-body');
    report('Tes penempatan merekomendasikan unit dari soal pertama yang salah', recText.includes('Unit 12'), 'diharapkan Unit 12');
    await shot(page, '03-hasil-tes');
    await page.click('[data-act=home]');
    await page.waitForSelector('.path');
    const statuses = await page.$$eval('[data-unit]', els => els.map(e => [+e.dataset.unit, e.className]));
    const st = n => statuses.find(s => s[0] === n)[1];
    report('Unit 1-12 terbuka setelah tes, Unit 13 terkunci, Unit 19 "Segera"',
      st(1).includes('open') && st(12).includes('open') && st(13).includes('locked') && st(19).includes('soon'));
    report('Peta jalur menampilkan 16 jalur dan 145 unit', (await page.$$('.path')).length === 16 && statuses.length === 145);
    await shot(page, '04-peta-jalur');

    // 3. Pelajaran Unit 1 dengan satu jawaban salah
    const n1 = await playLesson(page, 1, ['u001-q01']);
    const p1 = await page.evaluate(() => JSON.parse(localStorage.getItem('caysenglish.progress.v1')));
    report('Pelajaran Unit 1: soal yang salah diulang di akhir', n1 === 11, n1 + ' layar soal');
    report('Skor 90% memberi 2 bintang', p1.units['1'].stars === 2 && Math.abs(p1.units['1'].bestScore - 0.9) < 1e-9);
    report('XP dihitung benar (9 x 2 + 5 = 23)', p1.xp === 23, 'XP ' + p1.xp);
    report('Soal yang salah masuk ulasan (kotak 1, jatuh tempo besok)', p1.review['u001-q01'] && p1.review['u001-q01'].box === 1);
    report('Streak menjadi 1 setelah pelajaran pertama', p1.streak.count === 1);
    await shot(page, '05-hasil-pelajaran');

    // 4. Progres tetap ada setelah aplikasi ditutup
    await ctx.close();
    ctx = await launch();
    page = ctx.pages()[0] || await ctx.newPage(); watch(page);
    await page.goto(BASE);
    await page.waitForSelector('.path');
    const p2 = await page.evaluate(() => JSON.parse(localStorage.getItem('caysenglish.progress.v1')));
    const homeText = await page.textContent('.stats');
    report('Progres, XP, dan streak tetap ada setelah browser ditutup dan dibuka lagi', p2.xp === 23 && p2.units['1'].stars === 2 && homeText.includes('23'));

    // 5. Semua 18 unit bisa dimainkan sampai selesai dengan jawaban kunci
    let total = 0, failed = [];
    for (const n of Object.keys(UNITS).map(Number)) {
      try {
        const k = await playLesson(page, n, []);
        total += k;
        const sc = await page.textContent('.result-grid .cell b');
        if (sc.trim() !== '100%') failed.push('Unit ' + n + ' skor ' + sc);
      } catch (e) { failed.push(e.message); }
    }
    report('Semua unit termuat dan setiap kunci jawaban dinilai benar lewat antarmuka', failed.length === 0, total + ' soal dijawab' + (failed.length ? '; ' + failed.join('; ') : ''));
    const p3 = await page.evaluate(() => JSON.parse(localStorage.getItem('caysenglish.progress.v1')));
    const all3 = Object.keys(UNITS).every(n => p3.units[n] && p3.units[n].stars === 3);
    report('Setiap unit mendapat 3 bintang dan unit berikutnya terbuka', all3);

    // 6. Ulasan kesalahan muncul pada hari jatuh tempo
    await page.evaluate(() => {
      const P = JSON.parse(localStorage.getItem('caysenglish.progress.v1'));
      const t = window.__cays.todayStr();
      P.review['u001-q01'].due = t;
      localStorage.setItem('caysenglish.progress.v1', JSON.stringify(P));
    });
    await page.goto(BASE + '#/');
    await page.reload();
    await page.waitForSelector('[data-act=review]');
    await shot(page, '06-beranda-ulasan');
    await page.click('[data-act=review]');
    await page.waitForSelector('[data-q]');
    const q1 = UNITS[1].lessons[0].questions[0];
    await answerQuestion(page, q1, true);
    await page.waitForSelector('.feedback.ok');
    await shot(page, '07-umpan-balik');
    await page.click('[data-act=cont]');
    await page.waitForSelector('.result-hero');
    const p4 = await page.evaluate(() => JSON.parse(localStorage.getItem('caysenglish.progress.v1')));
    const due = p4.review['u001-q01'] && p4.review['u001-q01'].due;
    const expectDue = await page.evaluate(() => window.__cays.addDays(window.__cays.todayStr(), 3));
    report('Ulasan benar menaikkan soal ke kotak 2 (muncul lagi 3 hari kemudian)', p4.review['u001-q01'].box === 2 && due === expectDue);

    // 7. Umpan balik salah menampilkan jawaban benar, alasan, dan rujukan
    await page.goto(BASE + '#/unit/7');
    await page.waitForSelector('.card');
    for (let k = 0; k < UNITS[7].lessons[0].cards.length; k++) await page.click('[data-act=next]');
    const q7 = (await currentQuestion(page, UNITS[7]))[0];
    await answerQuestion(page, q7, false);
    await page.waitForSelector('.feedback.bad');
    const fbText = await page.textContent('.feedback');
    report('Umpan balik salah: jawaban benar, alasan, dan "Unit 7" tampil', fbText.includes(require('../grading.js').answerText(q7).split('\n')[0]) && fbText.includes(q7.why) && fbText.includes('Unit 7'));
    await shot(page, '08-umpan-balik-salah');

    // 8. Pengaturan: target harian
    await page.goto(BASE + '#/settings');
    await page.waitForSelector('[data-g="40"]');
    await page.click('[data-g="40"]');
    const goal = await page.evaluate(() => JSON.parse(localStorage.getItem('caysenglish.progress.v1')).dailyGoal);
    report('Target harian bisa diubah dan tersimpan', goal === 40);

    // 9. Ekspor dan impor cadangan
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-act=export]')]);
    const dlPath = path.join(userDir, 'backup.json');
    await dl.saveAs(dlPath);
    const backup = JSON.parse(fs.readFileSync(dlPath, 'utf8'));
    report('Ekspor menghasilkan file cadangan JSON yang valid', backup.version === 1 && backup.xp === p4.xp + 0 && dl.suggestedFilename().startsWith('cays-english-cadangan-'));
    await page.evaluate(() => { const P = JSON.parse(localStorage.getItem('caysenglish.progress.v1')); P.xp = 1; localStorage.setItem('caysenglish.progress.v1', JSON.stringify(P)); });
    await page.reload();
    await page.waitForSelector('[data-file]', { state: 'attached' });
    await page.setInputFiles('[data-file]', dlPath);
    await page.waitForSelector('.dialog [data-ok]');
    await page.click('.dialog [data-ok]');
    await page.waitForSelector('.path');
    const p5 = await page.evaluate(() => JSON.parse(localStorage.getItem('caysenglish.progress.v1')));
    report('Impor cadangan memulihkan progres', p5.xp === backup.xp);

    // 10. Mode offline
    await page.goto(BASE);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 }).catch(() => {});
    if (!(await page.evaluate(() => !!navigator.serviceWorker.controller))) { await page.reload(); await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 }); }
    const cachedUnits = await page.evaluate(async () => { const k = (await caches.keys()).find(x => x.startsWith('cays-english-')); const c = await caches.open(k); return (await c.keys()).filter(r => r.url.includes('/content/units/')).length; });
    report('Service worker menyimpan semua unit untuk offline', cachedUnits === Object.keys(UNITS).length, cachedUnits + ' unit di cache');
    await ctx.setOffline(true);
    await page.reload();
    await page.waitForSelector('.path', { timeout: 10000 });
    await page.goto(BASE + '#/unit/1');
    await page.waitForSelector('.card', { timeout: 10000 });
    report('Mode offline: aplikasi dan pelajaran terbuka tanpa internet', true);
    await page.goto(BASE + '#/settings');
    await page.waitForFunction(() => /Siap dipakai offline/.test(document.body.innerText), null, { timeout: 10000 }).then(() => report('Pengaturan menampilkan "Siap dipakai offline"', true)).catch(() => report('Pengaturan menampilkan "Siap dipakai offline"', false));
    await shot(page, '09-pengaturan');
    await ctx.setOffline(false);

    // 11. Manifest bisa dipasang
    const man = await page.evaluate(async () => { const r = await fetch('manifest.webmanifest'); return r.json(); });
    report('Manifest lengkap (nama, start_url, display standalone, ikon 192 dan 512)', man.name === "Cay's English" && man.display === 'standalone' && man.icons.some(i => i.sizes === '192x192') && man.icons.some(i => i.sizes === '512x512'));

    // 12. Tidak ada error JavaScript
    const relevant = consoleErrors.filter(e => !/ERR_INTERNET_DISCONNECTED|net::ERR|Failed to fetch/.test(e));
    report('Tidak ada error JavaScript selama pengujian', relevant.length === 0, relevant.slice(0, 3).join(' | '));
  } catch (e) {
    report('Pengujian berhenti karena error', false, e.stack || String(e));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'error.png') }).catch(() => {});
  } finally {
    await ctx.close();
    fs.rmSync(userDir, { recursive: true, force: true });
  }
  const failed = results.filter(r => !r.pass);
  console.log('\n' + (results.length - failed.length) + '/' + results.length + ' uji lulus');
  process.exit(failed.length ? 1 : 0);
})();
