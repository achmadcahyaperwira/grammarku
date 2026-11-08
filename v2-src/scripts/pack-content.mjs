// Gabungkan content/units/uNNN.json menjadi public/packs/gNN.json per kelompok,
// lalu tulis public/catalog.json dengan status rilis dan jumlah soal.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GROUPS, UNITS, EXTRA_KW, CONTENT_VERSION } from './catalog-src.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const unitsDir = join(root, 'content/units');
const outDir = join(root, 'public/packs');
if (existsSync(outDir)) rmSync(outDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

if (UNITS.length !== 145) throw new Error(`Jumlah judul unit ${UNITS.length}, seharusnya 145`);
const pad = (n, w = 3) => String(n).padStart(w, '0');
const groupOf = (no) => GROUPS.find((g) => no >= g.range[0] && no <= g.range[1]);

const catalogUnits = [];
const packs = new Map();
for (let no = 1; no <= 145; no++) {
  const g = groupOf(no);
  const gi = GROUPS.indexOf(g) + 1;
  const file = join(unitsDir, `u${pad(no)}.json`);
  const released = existsSync(file);
  const packPath = `packs/g${pad(gi, 2)}.json`;
  let questionCount = 0;
  if (released) {
    const u = JSON.parse(readFileSync(file, 'utf8'));
    questionCount = u.questions.length;
    if (!packs.has(packPath)) packs.set(packPath, []);
    packs.get(packPath).push(u);
  }
  const title = UNITS[no - 1];
  const kw = [...new Set([...(EXTRA_KW[no] ?? []), ...g.kw])];
  catalogUnits.push({ no, groupId: g.id, title, keywords: kw, released, questionCount, ...(released ? { pack: packPath } : {}) });
}

for (const [p, units] of packs) writeFileSync(join(root, 'public', p), JSON.stringify({ units }));

const catalog = {
  schemaVersion: 1,
  contentVersion: CONTENT_VERSION,
  book: { title: 'English Grammar in Use', edition: 5, year: 2019, units: 145 },
  groups: GROUPS.map((g, i) => ({ id: g.id, title: g.title, unitRange: g.range, pack: `packs/g${pad(i + 1, 2)}.json` })),
  units: catalogUnits
};
writeFileSync(join(root, 'public/catalog.json'), JSON.stringify(catalog));
const rel = catalogUnits.filter((u) => u.released);
console.log(`Katalog: 145 unit, ${rel.length} dirilis, ${rel.reduce((a, u) => a + u.questionCount, 0)} soal, ${packs.size} paket.`);
// sisa file lama tidak ada karena folder dibersihkan
void readdirSync;
