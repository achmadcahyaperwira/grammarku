// Uji alur di Chromium dengan emulasi HP.
// Pemakaian: node tests/e2e.cjs http://127.0.0.1:8080/grammarku/v2/ <folder-screenshot>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://127.0.0.1:8080/grammarku/v2/';
const OUT = process.argv[3] || 'test-results';
fs.mkdirSync(OUT, { recursive: true });
const DIST = path.join(__dirname, '..', '..', 'v2');
const packs = fs.readdirSync(path.join(DIST, 'packs')).flatMap((f) => JSON.parse(fs.readFileSync(path.join(DIST, 'packs', f), 'utf8')).units);
const Q = new Map(packs.flatMap((u) => u.questions.map((q) => [q.id, q])));

let failures = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? 'LULUS' : 'GAGAL'}  ${msg}`);
  if (!cond) failures++;
};

async function answer(page, correct) {
  const qid = await page.getAttribute('.question', 'data-qid');
  const q = Q.get(qid);
  if (q.type === 'mc') {
    const id = correct ? q.answer : q.options.find((o) => o.id !== q.answer).id;
    await page.click(`.option[data-opt="${id}"]`);
  } else if (q.type === 'gap') {
    const inputs = await page.$$('.gap-input');
    for (let i = 0; i < inputs.length; i++) await inputs[i].fill(correct ? q.blanks[i].accept[0] : 'zzz');
  } else if (q.type === 'order') {
    const seq = correct ? q.accept[0] : [...q.accept[0]].reverse();
    for (const t of seq) {
      await page.evaluate((t) => {
        const b = [...document.querySelectorAll('.bank .tok')].find((x) => !x.disabled && x.textContent === t);
        b.click();
      }, t);
    }
  } else if (q.type === 'fix') {
    const seg = correct ? q.errorIndex : (q.errorIndex + 1) % q.segments.length;
    await page.click(`.seg >> nth=${seg}`);
    await page.fill('.fix-field input', correct ? q.accept[0] : 'zzz');
  }
  await page.click('.sticky-action .btn');
  await page.waitForSelector('.feedback');
  const verdict = (await page.textContent('.feedback .verdict')).trim();
  return { qid, type: q.type, verdict };
}

async function runSession(page, correct, shotPrefix) {
  const results = [];
  for (let i = 0; i < 40; i++) {
    if (await page.$('.score')) break;
    await page.waitForSelector('.question');
    const r = await answer(page, typeof correct === 'function' ? correct(i) : correct);
    results.push(r);
    if (shotPrefix && i < 4) await page.screenshot({ path: `${OUT}/${shotPrefix}-${i + 1}-${r.type}.png` });
    await page.click('.feedback .btn');
    await page.waitForFunction((last) => document.querySelector('.score') || (document.querySelector('.question') && document.querySelector('.question').dataset.qid !== last && !document.querySelector('.feedback')), r.qid);
  }
  return results;
}

async function noHScroll(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true, acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.clock.install({ time: new Date('2026-11-08T09:00:00') });

  // --- Beranda dan daftar unit
  await page.goto(BASE);
  await page.waitForSelector('.hello');
  ok((await page.textContent('.streak')).includes('0 dari 10'), 'Beranda menampilkan target 0/10');
  await page.goto(BASE + '#/unit');
  await page.waitForSelector('.toc');
  ok((await page.$$('.toc-row')).length === 145, 'Daftar unit berisi 145 baris');
  ok((await page.$$('.toc-row.locked')).length === 127, '127 unit berlabel Segera');
  await page.fill('.search input', 'since');
  ok((await page.textContent('.toc')).includes('for and since'), 'Pencarian "since" menampilkan Unit 12');
  await page.fill('.search input', '12');
  const first = await page.textContent('.toc-row .no');
  ok(first.trim() === '12', 'Pencarian "12" menaruh Unit 12 di urutan pertama');
  await page.fill('.search input', 'zzzz');
  ok((await page.textContent('.empty')).includes('Tidak ada unit yang cocok'), 'Pencarian kosong memberi pesan');
  await page.click('.empty .btn');
  await page.click('.chip:has-text("Modals")');
  const nos = await page.$$eval('.toc-row .no', (els) => els.map((e) => Number(e.textContent)));
  ok(nos.length === 12 && nos[0] === 26 && nos.at(-1) === 37, 'Filter Modals hanya Unit 26–37');
  await page.goto(BASE + '#/unit/1');
  await page.waitForSelector('.sheet');
  await page.goBack();
  await page.waitForSelector('.toc');
  ok((await page.getAttribute('.chip:has-text("Modals")', 'aria-pressed')) === 'true', 'Filter tetap terpasang setelah kembali');
  await page.click('.chip:has-text("Semua")');

  // --- Sesi penuh, semua benar
  await page.goto(BASE + '#/unit/1');
  await page.waitForSelector('.sheet');
  ok((await page.$$('.sheet')).length === 4, 'Halaman materi punya 4 bagian');
  await page.click('.sticky-action .btn');
  const r1 = await runSession(page, true, 'u1');
  ok(r1.length === 20 && r1.every((r) => r.verdict.includes('Benar')), `Unit 1: 20 jawaban benar dinilai benar (${r1.filter((r) => r.verdict.includes('Benar')).length}/20)`);
  ok((await page.textContent('.score .big')).trim() === '100%', 'Ringkasan 100%');
  ok((await page.textContent('.stamp')).includes('Unit selesai'), 'Cap "Unit selesai" muncul');
  await page.screenshot({ path: `${OUT}/summary-100.png` });

  // --- Sesi penuh, semua salah (Unit 2)
  await page.goto(BASE + '#/practice/2');
  const r2 = await runSession(page, false, 'u2-wrong');
  ok(r2.every((r) => r.verdict.includes('Belum tepat')), `Unit 2: 20 jawaban salah dinilai salah (${r2.filter((r) => r.verdict.includes('Belum')).length}/20)`);
  await page.screenshot({ path: `${OUT}/summary-0.png` });
  ok((await page.$$('.wrong-list li')).length === 20, 'Daftar soal salah berisi 20');
  await page.click('button:has-text("Ulangi yang salah")');
  await page.waitForSelector('.question');
  ok((await page.textContent('.topbar .title')).includes('ulangi yang salah'), 'Putaran ulang yang salah dimulai');
  await page.click('.topbar .icon-btn');

  await page.goto(BASE + '#/');
  await page.waitForSelector('.hello');
  ok((await page.textContent('.card')).includes('Tidak ada ulangan hari ini'), 'Hari ini belum ada yang jatuh tempo');
  ok((await page.textContent('.streak-num')).trim() === '1', 'Streak 1 setelah 40+ jawaban');
  await page.screenshot({ path: `${OUT}/home-after.png` });

  // --- Besok: bank kesalahan jatuh tempo
  await page.clock.setSystemTime(new Date('2026-11-09T09:00:00'));
  await page.reload();
  await page.waitForSelector('.hello');
  ok((await page.textContent('.card.due')).includes('20 soal'), 'Besoknya 20 soal jatuh tempo');
  ok((await page.textContent('.badge')).trim() === '20', 'Badge tab Ulangan = 20');
  await page.goto(BASE + '#/review');
  await page.waitForSelector('.bank-item');
  ok((await page.$$('.bank-item')).length === 20, 'Bank kesalahan menampilkan 20 soal');
  await page.screenshot({ path: `${OUT}/bank.png` });
  await page.goto(BASE + '#/review/start');
  const rr = await runSession(page, (i) => i % 2 === 0, 'review');
  ok(rr.length === 20, 'Sesi ulangan berisi 20 soal');
  await page.goto(BASE + '#/review');
  await page.waitForSelector('.bank-item');
  const boxes = await page.$$eval('.bank-item .row span span', (els) => els.map((e) => e.textContent));
  const txt = await page.textContent('main');
  ok(txt.includes('kotak 2') && txt.includes('kotak 1'), 'Benar naik ke kotak 2, salah tetap kotak 1');
  void boxes;

  // --- Progres
  await page.goto(BASE + '#/progress');
  await page.waitForSelector('.stat');
  ok((await page.textContent('.stat')).includes('1/145'), 'Progres: 1/145 unit selesai');
  await page.screenshot({ path: `${OUT}/progress.png` });

  // --- Lebar layar
  for (const w of [360, 390, 430]) {
    await page.setViewportSize({ width: w, height: 800 });
    let all = true;
    for (const h of ['#/', '#/unit', '#/unit/12', '#/practice/12', '#/review', '#/progress', '#/settings']) {
      await page.goto(BASE + h);
      await page.waitForTimeout(250);
      if (!(await noHScroll(page))) {
        all = false;
        console.log('   geser horizontal di', w, h);
      }
    }
    ok(all, `Tanpa geser horizontal di lebar ${w}px`);
  }
  await page.setViewportSize({ width: 360, height: 780 });

  // --- Ekspor
  await page.goto(BASE + '#/settings');
  await page.waitForSelector('.setting');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Ekspor cadangan")')]);
  const file = path.join(OUT, await dl.suggestedFilename());
  await dl.saveAs(file);
  ok(/grammar-backup-\d{4}-\d{2}-\d{2}\.json$/.test(file), 'Nama file cadangan sesuai format');
  await page.waitForSelector('.notice.ok');
  ok((await page.textContent('.setting')).includes('Cadangan terakhir'), 'Tanggal cadangan terakhir tampil');
  await page.screenshot({ path: `${OUT}/settings.png`, fullPage: true });

  // --- Offline
  await page.goto(BASE + '#/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 });
  await ctx.setOffline(true);
  await page.reload();
  await page.waitForSelector('.hello', { timeout: 10000 });
  await page.goto(BASE + '#/unit/15');
  await page.waitForSelector('.sheet', { timeout: 10000 });
  await page.goto(BASE + '#/practice/18');
  await page.waitForSelector('.question', { timeout: 10000 });
  ok(true, 'Offline: beranda, materi Unit 15, dan latihan Unit 18 terbuka');
  await ctx.setOffline(false);

  // --- Impor di "HP lain" (konteks baru, data kosong)
  const ctx2 = await browser.newContext({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true });
  const p2 = await ctx2.newPage();
  await p2.clock.install({ time: new Date('2026-11-09T10:00:00') });
  await p2.goto(BASE + '#/settings');
  await p2.waitForSelector('.setting');
  await p2.setInputFiles('#imp', path.join(OUT, 'bad.json'), { noWaitAfter: true }).catch(async () => {
    fs.writeFileSync(path.join(OUT, 'bad.json'), '{"app":"lain"}');
    await p2.setInputFiles('#imp', path.join(OUT, 'bad.json'));
  });
  await p2.waitForSelector('.notice.bad');
  ok((await p2.textContent('.notice.bad')).includes('bukan cadangan'), 'File salah ditolak dengan pesan jelas');
  await p2.setInputFiles('#imp', file);
  await p2.waitForSelector('button:has-text("Ya, ganti data")');
  await p2.click('button:has-text("Ya, ganti data")');
  await p2.waitForSelector('.notice.ok');
  await p2.goto(BASE + '#/progress');
  await p2.waitForSelector('.stat');
  ok((await p2.textContent('.stat')).includes('1/145'), 'Setelah impor: 1/145 unit selesai');
  await p2.goto(BASE + '#/review');
  await p2.waitForSelector('.bank-item');
  ok((await p2.$$('.bank-item')).length === 20, 'Setelah impor: bank kesalahan 20 soal');

  // --- Mode gelap
  const ctx3 = await browser.newContext({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true, colorScheme: 'dark' });
  const p3 = await ctx3.newPage();
  for (const [h, n] of [['#/', 'home'], ['#/unit', 'units'], ['#/unit/9', 'lesson'], ['#/practice/9', 'practice']]) {
    await p3.goto(BASE + h);
    await p3.waitForTimeout(400);
    await p3.screenshot({ path: `${OUT}/dark-${n}.png` });
  }
  const bg = await p3.evaluate(() => getComputedStyle(document.body).backgroundColor);
  ok(bg === 'rgb(16, 24, 40)', `Mode gelap mengikuti pengaturan HP (${bg})`);

  // --- Manifest
  const man = await (await page.request.get(BASE + 'manifest.webmanifest')).json();
  ok(man.display === 'standalone' && man.name === "Cay's English V2" && man.icons.length === 3, 'Manifest: standalone, nama, 3 ikon');

  ok(errors.length === 0, `Tanpa error JavaScript (${errors.length})`);
  if (errors.length) console.log(errors.slice(0, 5));
  await browser.close();
  console.log(failures ? `\n${failures} GAGAL` : '\nSEMUA LULUS');
  process.exit(failures ? 1 : 0);
})();
