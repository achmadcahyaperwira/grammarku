import { useMemo, useState } from 'preact/hooks';
import { useApp, lsGet, lsSet, pct } from '../lib/store';
import { IconClose, IconSearch, StatusMark } from '../components/icons';
import type { CatalogUnit } from '../lib/types';

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‘’]/g, "'")
    .replace(/[…]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function filterUnits(units: CatalogUnit[], query: string, group: string): CatalogUnit[] {
  const q = norm(query);
  let list = group === 'all' ? units : units.filter((u) => u.groupId === group);
  if (!q) return list;
  const num = /^\d+$/.test(q) ? Number(q) : null;
  const hay = (u: CatalogUnit) => norm(`${u.no} ${u.title} ${u.keywords.join(' ')}`);
  list = list.filter((u) => (num != null && String(u.no).startsWith(q)) || hay(u).includes(q));
  if (num != null) list = [...list].sort((a, b) => (a.no === num ? -1 : b.no === num ? 1 : a.no - b.no));
  return list;
}

export function UnitList() {
  const { catalog, progress } = useApp();
  const [query, setQuery] = useState(() => lsGet('v2:q') ?? '');
  const [group, setGroup] = useState(() => lsGet('v2:g') ?? 'all');

  const setQ = (v: string) => {
    setQuery(v);
    lsSet('v2:q', v);
  };
  const setG = (v: string) => {
    setGroup(v);
    lsSet('v2:g', v);
  };

  const list = useMemo(() => filterUnits(catalog.units, query, group), [catalog, query, group]);
  const searching = norm(query).length > 0;
  const groupsShown = catalog.groups.filter((g) => list.some((u) => u.groupId === g.id));

  const row = (u: CatalogUnit) => {
    const p = progress.get(u.no);
    const inner = (
      <>
        <span class="no">{u.no}</span>
        <span class="t" lang="en">
          {u.title}
        </span>
        {u.released ? (
          <span class="status">
            {p?.bestScore != null && pct(p.bestScore)}
            <StatusMark status={p?.status ?? 'new'} />
            <span class="visually-hidden">{p?.status === 'done' ? 'Selesai' : p?.status === 'learning' ? 'Sedang dipelajari' : 'Belum mulai'}</span>
          </span>
        ) : (
          <span class="soon">Segera</span>
        )}
      </>
    );
    return (
      <li key={u.no}>
        {u.released ? (
          <a class="toc-row" href={`#/unit/${u.no}`}>
            {inner}
          </a>
        ) : (
          <div class="toc-row locked" aria-disabled="true">
            {inner}
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      <header class="topbar">
        <div class="title">Daftar unit</div>
      </header>
      <main class="page">
        <div class="search" role="search">
          <IconSearch />
          <input
            type="search"
            placeholder="Cari unit, mis. since atau 12"
            aria-label="Cari unit"
            value={query}
            onInput={(e) => setQ((e.target as HTMLInputElement).value)}
            autocomplete="off"
            autocapitalize="off"
            spellcheck={false}
          />
          {query && (
            <button class="icon-btn" aria-label="Hapus pencarian" onClick={() => setQ('')}>
              <IconClose />
            </button>
          )}
        </div>
        <div class="chips" role="group" aria-label="Filter kelompok topik">
          <button class="chip" aria-pressed={group === 'all'} onClick={() => setG('all')}>
            Semua
          </button>
          {catalog.groups.map((g) => (
            <button key={g.id} class="chip" aria-pressed={group === g.id} onClick={() => setG(g.id)} lang="en">
              {g.title}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div class="empty">
            <p>Tidak ada unit yang cocok.</p>
            <button
              class="btn secondary"
              onClick={() => {
                setQ('');
                setG('all');
              }}
            >
              Hapus pencarian
            </button>
          </div>
        ) : searching ? (
          <section class="toc">
            <h2>{list.length} unit cocok</h2>
            <ol>{list.map(row)}</ol>
          </section>
        ) : (
          groupsShown.map((g) => (
            <section class="toc" key={g.id}>
              <h2 lang="en">
                {g.title} <span class="muted">({g.unitRange[0]}–{g.unitRange[1]})</span>
              </h2>
              <ol>{list.filter((u) => u.groupId === g.id).map(row)}</ol>
            </section>
          ))
        )}
      </main>
    </>
  );
}
