#!/usr/bin/env node
/* Pemeriksa materi Cay's English.
 * Jalankan: node tools/validate.js
 * Gagal (exit 1) jika ada soal yang tidak valid.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const G = require('../grading.js');

const ROOT = path.join(__dirname, '..');
const C = path.join(ROOT, 'content');
const errors = [];
const warnings = [];
let checks = 0;
function err(where, msg) { errors.push(where + ': ' + msg); }
function ok(cond, where, msg) { checks++; if (!cond) err(where, msg); return cond; }

// ---------------------------------------------------------------- uji penilai
const gradeCases = [
  [{ type: 'fill', answer: 'is not', accept: [] }, "isn't", true],
  [{ type: 'fill', answer: "isn't", accept: [] }, 'is not', true],
  [{ type: 'translate', answer: 'She has lost her key', accept: [] }, "She's lost her key.", true],
  [{ type: 'translate', answer: 'She is reading', accept: [] }, "she's reading", true],
  [{ type: 'translate', answer: 'She has two brothers', accept: [] }, "She's two brothers", false],
  [{ type: 'translate', answer: 'She has got two brothers', accept: [] }, "She's got two brothers", true],
  [{ type: 'translate', answer: 'It is raining', accept: [] }, 'Its raining', false],
  [{ type: 'translate', answer: 'I have never met him', accept: [] }, "I’ve never met him!", true],
  [{ type: 'translate', answer: 'We will help', accept: [] }, "We'll help", true],
  [{ type: 'translate', answer: 'I will not go', accept: [] }, "I won't go", true],
  [{ type: 'translate', answer: 'They had left', accept: [] }, "They'd left", true],
  [{ type: 'fill', answer: 'studied', accept: [] }, 'studyed', false],
  [{ type: 'fill', answer: 'works', accept: [] }, 'work', false],
  [{ type: 'fill', answer: 'cannot', accept: [] }, "can't", true],
  [{ type: 'translate', answer: 'When I arrived, they had left', accept: [] }, 'when i arrived they had left', true],
  [{ type: 'translate', answer: 'He is lost', accept: [] }, "He's lost", true],
];
gradeCases.forEach(([q, resp, expect], i) => {
  ok(G.grade(q, resp) === expect, 'grading#' + (i + 1), JSON.stringify(resp) + ' vs ' + JSON.stringify(q.answer) + ' seharusnya ' + expect);
});

// ---------------------------------------------------------------- index
const index = JSON.parse(fs.readFileSync(path.join(C, 'index.json'), 'utf8'));
ok(index.units.length === 145, 'index', 'harus ada 145 unit, ada ' + index.units.length);
index.units.forEach((u, i) => ok(u.n === i + 1, 'index', 'nomor unit tidak berurutan di posisi ' + i));
const inPaths = [].concat(...index.paths.map(p => p.units));
ok(inPaths.length === 145 && new Set(inPaths).size === 145, 'index', 'jalur harus mencakup 145 unit tepat satu kali');
index.paths.forEach(p => p.units.forEach(n => ok(index.units[n - 1].path === p.id, 'index', 'unit ' + n + ' salah jalur')));
const available = index.units.filter(u => u.available);
available.forEach(u => ok(fs.existsSync(path.join(C, 'units', u.file)), 'index', 'file ' + u.file + ' tidak ada'));
const files = fs.readdirSync(path.join(C, 'units')).filter(f => f.endsWith('.json'));
files.forEach(f => ok(available.some(u => u.file === f), 'index', f + ' ada di folder tetapi tidak terdaftar sebagai available'));
// unit harus berurutan tanpa celah (karena unit terbuka bertahap)
available.forEach((u, i) => ok(u.n === i + 1, 'index', 'unit tersedia harus berurutan mulai Unit 1; celah di Unit ' + u.n));

// ---------------------------------------------------------------- unit
const AMBIG = /\b(he|she|it|there|that|what|who|where|here|how|when|why|everything|nothing|something|everybody|everyone|somebody|someone|nobody|this)'s\b|\b(i|you|he|she|it|we|they|there|who|that)'d\b/i;
const ids = new Set();
const stats = { units: 0, questions: 0, types: {} };

function sentences(s) {
  return String(s).replace(/\b(dll|dsb|mis|e\.g|i\.e)\./g, '$1').split(/[.!?](\s|$)/).filter(x => x && x.trim()).length;
}
function wordBag(s) { return G.basic(s).split(' ').sort().join(' '); }

available.forEach(info => {
  const where = 'Unit ' + info.n;
  let u;
  try { u = JSON.parse(fs.readFileSync(path.join(C, 'units', info.file), 'utf8')); }
  catch (e) { return err(where, 'JSON tidak valid: ' + e.message); }
  stats.units++;
  ok(u.unit === info.n, where, 'nomor unit di file (' + u.unit + ') tidak cocok');
  ok(u.path === info.path, where, 'jalur di file tidak cocok dengan index');
  ok(u.title === info.title, where, 'judul di file tidak cocok dengan index');
  ok(Array.isArray(u.lessons) && u.lessons.length >= 1, where, 'tidak ada pelajaran');
  (u.lessons || []).forEach(lesson => {
    const lw = where + ' ' + lesson.id;
    ok(Array.isArray(lesson.cards) && lesson.cards.length >= 1, lw, 'tidak ada kartu penjelasan');
    (lesson.cards || []).forEach((c, k) => {
      ok(c.text && c.text.length > 20, lw + ' kartu ' + (k + 1), 'teks penjelasan kosong');
      ok(Array.isArray(c.examples) && c.examples.length >= 1, lw + ' kartu ' + (k + 1), 'tidak ada contoh kalimat');
    });
    const qs = lesson.questions || [];
    ok(qs.length >= 8 && qs.length <= 12, lw, 'jumlah soal harus 8-12, ada ' + qs.length);
    const types = new Set(qs.map(q => q.type));
    ok(types.size >= 4, lw, 'minimal 4 jenis soal, ada ' + types.size);
    for (let i = 1; i < qs.length; i++) ok(qs[i].type !== qs[i - 1].type, lw, 'soal ' + i + ' dan ' + (i + 1) + ' berjenis sama (' + qs[i].type + ')');
    qs.forEach(q => {
      const qw = lw + ' ' + q.id;
      stats.questions++;
      stats.types[q.type] = (stats.types[q.type] || 0) + 1;
      ok(!ids.has(q.id), qw, 'ID soal kembar'); ids.add(q.id);
      ok(q.ref === info.n, qw, 'ref harus ' + info.n);
      ok(typeof q.why === 'string' && q.why.length >= 15, qw, 'alasan kosong');
      ok(sentences(q.why) <= 2, qw, 'alasan lebih dari 2 kalimat');
      const keyList = [q.answer].concat(q.accept || []).filter(x => x != null);
      if (q.type !== 'choice' && q.type !== 'match') {
        keyList.forEach(k => ok(!AMBIG.test(k), qw, 'kunci "' + k + '" memakai \'s/\'d yang ambigu; tulis bentuk panjang'));
      }
      switch (q.type) {
        case 'choice': {
          ok(Array.isArray(q.choices) && q.choices.length >= 2, qw, 'pilihan kurang');
          ok(new Set(q.choices.map(G.basic)).size === q.choices.length, qw, 'ada pilihan kembar');
          ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.choices.length, qw, 'index jawaban benar tidak valid');
          const right = q.choices.map((_, i) => G.grade(q, i)).filter(Boolean).length;
          ok(right === 1, qw, 'harus tepat satu pilihan benar, ada ' + right);
          ok(/_{3,}/.test(q.prompt), qw, 'soal pilihan ganda butuh tanda ___');
          break;
        }
        case 'fill':
        case 'verbform':
          ok(/_{3,}/.test(q.prompt), qw, 'tidak ada bagian kosong ___');
          if (q.type === 'verbform') ok(/\(.+\)/.test(q.prompt), qw, 'tidak ada kata kerja dalam kurung');
          ok(q.answer && G.grade(q, q.answer), qw, 'kunci jawaban tidak lolos penilai');
          (q.accept || []).forEach(a => ok(G.grade(q, a), qw, 'varian "' + a + '" tidak lolos penilai'));
          ok(!G.grade(q, ''), qw, 'jawaban kosong dinilai benar');
          break;
        case 'translate':
          ok(q.source && q.source.length > 3, qw, 'kalimat sumber kosong');
          ok(G.grade(q, q.answer), qw, 'kunci jawaban tidak lolos penilai');
          (q.accept || []).forEach(a => ok(G.grade(q, a), qw, 'varian "' + a + '" tidak lolos penilai'));
          break;
        case 'correct':
          if (q.isCorrect) {
            ok(G.grade(q, { ok: true }), qw, '"Sudah benar" harus dinilai benar');
            ok(G.grade(q, { text: q.prompt }), qw, 'kalimat asli harus dinilai benar');
          } else {
            ok(!G.grade(q, { ok: true }), qw, '"Sudah benar" tidak boleh dinilai benar');
            ok(!G.grade(q, { text: q.prompt }), qw, 'kalimat salah ikut dinilai benar');
            ok(G.basic(q.answer) !== G.basic(q.prompt), qw, 'kunci sama dengan kalimat salah');
            ok(G.grade(q, { text: q.answer }), qw, 'kunci jawaban tidak lolos penilai');
            (q.accept || []).forEach(a => ok(G.grade(q, { text: a }), qw, 'varian "' + a + '" tidak lolos penilai'));
          }
          break;
        case 'order':
          ok(Array.isArray(q.tokens) && q.tokens.length >= 3, qw, 'kartu kata kurang dari 3');
          ok(G.grade(q, q.tokens), qw, 'kartu kata tidak membentuk kunci jawaban');
          ok(G.basic(q.tokens.join(' ')) === G.basic(q.answer), qw, 'jawaban tidak sama dengan gabungan kartu');
          (q.accept || []).forEach(a => ok(wordBag(a) === wordBag(q.tokens.join(' ')), qw, 'varian "' + a + '" tidak bisa disusun dari kartu yang ada'));
          if (q.tokens.length >= 3) ok(!G.grade(q, q.tokens.slice().reverse()), qw, 'urutan terbalik ikut dinilai benar');
          break;
        case 'match': {
          ok(Array.isArray(q.pairs) && q.pairs.length === 4, qw, 'jodohkan harus 4 pasang');
          ok(new Set(q.pairs.map(p => p[0])).size === q.pairs.length, qw, 'kolom kiri kembar');
          ok(new Set(q.pairs.map(p => p[1])).size === q.pairs.length, qw, 'kolom kanan kembar');
          ok(G.grade(q, q.pairs.map((_, i) => i)), qw, 'pasangan benar tidak lolos penilai');
          ok(!G.grade(q, [1, 0, 2, 3]), qw, 'pasangan tertukar ikut dinilai benar');
          break;
        }
        default:
          err(qw, 'jenis soal tidak dikenal: ' + q.type);
      }
    });
  });
});

// ---------------------------------------------------------------- tes penempatan
const pl = JSON.parse(fs.readFileSync(path.join(C, 'placement.json'), 'utf8'));
ok(pl.questions.length === 20, 'placement', 'harus 20 soal, ada ' + pl.questions.length);
let prevUnit = 0;
const pathsHit = new Set();
pl.questions.forEach(q => {
  const qw = 'placement ' + q.id;
  ok(q.unit >= 1 && q.unit <= 145, qw, 'unit tidak valid');
  ok(q.unit >= prevUnit, qw, 'soal harus urut menurut unit'); prevUnit = q.unit;
  pathsHit.add(index.units[q.unit - 1].path);
  const right = q.choices.map((_, i) => G.grade(q, i)).filter(Boolean).length;
  ok(right === 1, qw, 'harus tepat satu pilihan benar');
  ok(!ids.has(q.id), qw, 'ID kembar'); ids.add(q.id);
});
ok(pathsHit.size === 16, 'placement', 'tes harus mencakup 16 jalur, baru ' + pathsHit.size);

// ---------------------------------------------------------------- sw.js
const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
['index.html', 'style.css', 'grading.js', 'app.js', 'manifest.webmanifest', 'content/index.json', 'content/placement.json'].forEach(f =>
  ok(sw.includes("'" + f + "'"), 'sw.js', f + ' tidak ada di daftar cache'));

// ---------------------------------------------------------------- laporan
console.log('Unit tersedia : ' + stats.units + ' (Unit ' + available[0].n + '-' + available[available.length - 1].n + ')');
console.log('Jumlah soal   : ' + stats.questions + ' + ' + pl.questions.length + ' soal tes penempatan');
console.log('Jenis soal    : ' + Object.entries(stats.types).map(([k, v]) => k + ' ' + v).join(', '));
console.log('Pemeriksaan   : ' + checks + ', gagal ' + errors.length);
warnings.forEach(w => console.log('PERINGATAN ' + w));
if (errors.length) {
  errors.forEach(e => console.log('GAGAL ' + e));
  process.exit(1);
}
console.log('SEMUA LOLOS');
