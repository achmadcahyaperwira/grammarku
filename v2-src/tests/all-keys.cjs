// Kerjakan semua soal unit yang dirilis dengan kuncinya lewat UI; semuanya harus dinilai "Benar".
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = process.argv[2] || 'http://127.0.0.1:8080/grammarku/v2/';
const DIST = path.join(__dirname, '..', '..', 'v2');
const units = fs.readdirSync(path.join(DIST, 'packs')).flatMap((f) => JSON.parse(fs.readFileSync(path.join(DIST, 'packs', f), 'utf8')).units);
const Q = new Map(units.flatMap((u) => u.questions.map((q) => [q.id, q])));
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  let total = 0, good = 0; const bad = [];
  for (const u of units) {
    await p.goto(BASE + '#/practice/' + u.no);
    for (let i = 0; i < u.questions.length; i++) {
      await p.waitForSelector('.question');
      const qid = await p.getAttribute('.question', 'data-qid');
      const q = Q.get(qid);
      // pakai varian jawaban terakhir di daftar, supaya varian juga teruji
      if (q.type === 'mc') await p.click(`.option[data-opt="${q.answer}"]`);
      if (q.type === 'gap') { const ins = await p.$$('.gap-input'); for (let k = 0; k < ins.length; k++) await ins[k].fill(q.blanks[k].accept.at(-1)); }
      if (q.type === 'order') for (const t of q.accept.at(-1)) await p.evaluate((t) => [...document.querySelectorAll('.bank .tok')].find((x) => !x.disabled && x.textContent.toLowerCase() === t.toLowerCase()).click(), t);
      if (q.type === 'fix') { await p.click(`.seg >> nth=${q.errorIndex}`); await p.fill('.fix-field input', q.accept.at(-1)); }
      await p.click('.sticky-action .btn');
      await p.waitForSelector('.feedback');
      const v = await p.textContent('.feedback .verdict');
      total++; if (v.includes('Benar')) good++; else bad.push(qid);
      await p.click('.feedback .btn');
      await p.waitForFunction((last) => document.querySelector('.score') || (document.querySelector('.question') && document.querySelector('.question').dataset.qid !== last && !document.querySelector('.feedback')), qid);
    }
    await p.waitForSelector('.score');
  }
  console.log(`${good}/${total} kunci dinilai benar lewat UI`, bad.length ? 'GAGAL: ' + bad.join(', ') : '');
  await b.close();
  process.exit(bad.length ? 1 : 0);
})();
