import type { Catalog, Question, Unit } from './types';

let catalogP: Promise<Catalog> | null = null;
const packCache = new Map<string, Promise<Unit[]>>();

export function loadCatalog(): Promise<Catalog> {
  if (!catalogP) {
    catalogP = fetch('catalog.json').then((r) => {
      if (!r.ok) throw new Error('Katalog tidak bisa dimuat');
      return r.json();
    });
    catalogP.catch(() => (catalogP = null));
  }
  return catalogP;
}

function loadPack(pack: string): Promise<Unit[]> {
  let p = packCache.get(pack);
  if (!p) {
    p = fetch(pack).then((r) => {
      if (!r.ok) throw new Error('Materi tidak bisa dimuat');
      return r.json().then((j: { units: Unit[] }) => j.units);
    });
    p.catch(() => packCache.delete(pack));
    packCache.set(pack, p);
  }
  return p;
}

export async function loadUnit(no: number): Promise<Unit | null> {
  const cat = await loadCatalog();
  const cu = cat.units.find((u) => u.no === no);
  if (!cu || !cu.released || !cu.pack) return null;
  const units = await loadPack(cu.pack);
  return units.find((u) => u.no === no) ?? null;
}

/** Cari soal berdasarkan ID di unit-unit yang diminta. */
export async function loadQuestions(unitNos: number[]): Promise<Map<string, { q: Question; unit: Unit }>> {
  const out = new Map<string, { q: Question; unit: Unit }>();
  const uniq = [...new Set(unitNos)];
  const units = await Promise.all(uniq.map((n) => loadUnit(n).catch(() => null)));
  for (const u of units) {
    if (!u) continue;
    for (const q of u.questions) out.set(q.id, { q, unit: u });
  }
  return out;
}
