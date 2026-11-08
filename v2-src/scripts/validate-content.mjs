// Pemeriksa konten (PRD bagian 8.3). Gagal = build diblokir.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'content/units');
const files = readdirSync(dir).filter((f) => /^u\d{3}\.json$/.test(f)).sort();
const errors = [];
const warnings = [];
const allIds = new Set();
const err = (f, m) => errors.push(`${f}: ${m}`);

const nonEmpty = (s) => typeof s === 'string' && s.trim().length > 0;
const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[\s.,!?;:"]+|[\s.,!?;:"]+$/g, '')
    .replace(/\s+([,.!?;:])/g, '$1');

let totalQ = 0;
for (const f of files) {
  let u;
  try {
    u = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  } catch (e) {
    err(f, 'JSON tidak valid: ' + e.message);
    continue;
  }
  const no = Number(f.slice(1, 4));
  if (u.schemaVersion !== 1) err(f, 'schemaVersion harus 1');
  if (u.no !== no) err(f, `no ${u.no} tidak cocok dengan nama file`);
  if (!nonEmpty(u.title)) err(f, 'title kosong');
  const L = u.lesson;
  if (!L) err(f, 'lesson tidak ada');
  else {
    if (!nonEmpty(L.summary)) err(f, 'lesson.summary kosong');
    const words = L.summary.split(/\s+/).length;
    if (words > 600) err(f, `lesson.summary ${words} kata (> 600)`);
    if (!Array.isArray(L.patterns) || L.patterns.length < 1) err(f, 'minimal 1 pola');
    if (!Array.isArray(L.examples) || L.examples.length < 6) err(f, `minimal 6 contoh (ada ${L.examples?.length})`);
    for (const e of L.examples ?? []) if (!nonEmpty(e.en) || !nonEmpty(e.id)) err(f, 'contoh tanpa en/id');
    if (!Array.isArray(L.commonMistakes) || L.commonMistakes.length < 3) err(f, 'minimal 3 kesalahan umum');
    for (const m of L.commonMistakes ?? []) if (!nonEmpty(m.wrong) || !nonEmpty(m.right) || !nonEmpty(m.why)) err(f, 'kesalahan umum tidak lengkap');
  }
  const qs = u.questions ?? [];
  totalQ += qs.length;
  if (qs.length < 16) err(f, `hanya ${qs.length} soal (minimal 16)`);
  const types = new Set(qs.map((q) => q.type));
  if (types.size < 2) err(f, 'kurang dari 2 jenis soal');
  qs.forEach((q, i) => {
    const at = `${f} soal #${i + 1} (${q.id})`;
    if (!/^u\d{3}-q\d{2}$/.test(q.id ?? '')) errors.push(`${at}: format id salah`);
    else if (!q.id.startsWith(`u${String(no).padStart(3, '0')}-`)) errors.push(`${at}: id tidak sesuai unit`);
    if (allIds.has(q.id)) errors.push(`${at}: id ganda`);
    allIds.add(q.id);
    if (!nonEmpty(q.instruction)) errors.push(`${at}: instruction kosong`);
    if (!nonEmpty(q.explanation)) errors.push(`${at}: explanation kosong`);
    switch (q.type) {
      case 'mc': {
        if (!nonEmpty(q.sentence)) errors.push(`${at}: sentence kosong`);
        if (!Array.isArray(q.options) || q.options.length < 3 || q.options.length > 4) errors.push(`${at}: opsi harus 3-4`);
        const ids = (q.options ?? []).map((o) => o.id);
        if (new Set(ids).size !== ids.length) errors.push(`${at}: id opsi ganda`);
        if (!ids.includes(q.answer)) errors.push(`${at}: answer menunjuk opsi yang tidak ada`);
        const texts = (q.options ?? []).map((o) => norm(o.text));
        if (new Set(texts).size !== texts.length) errors.push(`${at}: teks opsi ganda`);
        for (const o of q.options ?? []) if (!nonEmpty(o.text) || !nonEmpty(o.why)) errors.push(`${at}: opsi ${o.id} tanpa text/why`);
        break;
      }
      case 'gap': {
        const marks = [...(q.sentence ?? '').matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1]));
        if (!marks.length) errors.push(`${at}: tidak ada penanda {{n}}`);
        if (marks.length !== (q.blanks ?? []).length) errors.push(`${at}: jumlah penanda ${marks.length} ≠ blanks ${q.blanks?.length}`);
        marks.forEach((m, k) => m !== k + 1 && errors.push(`${at}: penanda harus berurutan 1..n`));
        for (const b of q.blanks ?? []) {
          if (!Array.isArray(b.accept) || !b.accept.length || !b.accept.every(nonEmpty)) errors.push(`${at}: accept kosong`);
        }
        break;
      }
      case 'order': {
        if (!Array.isArray(q.tokens) || q.tokens.length < 3) errors.push(`${at}: token minimal 3`);
        if (!Array.isArray(q.accept) || !q.accept.length) errors.push(`${at}: accept kosong`);
        const bag = (a) => a.map((t) => t.toLowerCase()).sort().join('\u0001');
        for (const a of q.accept ?? []) if (bag(a) !== bag(q.tokens)) errors.push(`${at}: accept [${a.join(' ')}] tidak memakai token yang sama persis`);
        break;
      }
      case 'fix': {
        if (!Array.isArray(q.segments) || q.segments.length < 2) errors.push(`${at}: segmen minimal 2`);
        if (!Number.isInteger(q.errorIndex) || q.errorIndex < 0 || q.errorIndex >= q.segments.length) errors.push(`${at}: errorIndex di luar jangkauan`);
        if (!Array.isArray(q.accept) || !q.accept.length || !q.accept.every(nonEmpty)) errors.push(`${at}: accept kosong`);
        else {
          const rebuilt = q.segments.map((s, k) => (k === q.errorIndex ? q.accept[0] : s)).join(' ');
          if (norm(rebuilt) !== norm(q.corrected)) errors.push(`${at}: corrected ≠ segmen dengan accept[0]\n    rebuilt:   ${rebuilt}\n    corrected: ${q.corrected}`);
          if (q.accept.some((a) => norm(a) === norm(q.segments[q.errorIndex]))) errors.push(`${at}: perbaikan sama dengan teks yang salah`);
        }
        break;
      }
      default:
        errors.push(`${at}: jenis soal tidak dikenal "${q.type}"`);
    }
  });
  const count = { mc: 0, gap: 0, order: 0, fix: 0 };
  qs.forEach((q) => count[q.type]++);
  if (process.argv.includes('-v')) console.log(`${f}: ${qs.length} soal`, count);
}

for (const w of warnings) console.warn('PERINGATAN', w);
if (errors.length) {
  console.error(`\n${errors.length} MASALAH:\n` + errors.map((e) => ' - ' + e).join('\n'));
  process.exit(1);
}
console.log(`Konten lolos: ${files.length} unit, ${totalQ} soal.`);
