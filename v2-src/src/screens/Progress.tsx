import { useApp, pct } from '../lib/store';

export function Progress() {
  const { catalog, progress, streak } = useApp();
  const done = [...progress.values()].filter((p) => p.status === 'done').length;
  const scored = catalog.units.filter((u) => (progress.get(u.no)?.sessions ?? 0) > 0);

  return (
    <>
      <header class="topbar">
        <div class="title">Progres</div>
      </header>
      <main class="page">
        <div class="stat-row">
          <div class="stat">
            <b>
              {done}/{catalog.units.length}
            </b>
            <span>unit selesai</span>
          </div>
          <div class="stat">
            <b>{streak.current}</b>
            <span>streak (hari)</span>
          </div>
          <div class="stat">
            <b>{streak.longest}</b>
            <span>streak terpanjang</span>
          </div>
        </div>

        <h2 style={{ fontSize: 17, marginBottom: 6 }}>Per kelompok topik</h2>
        <ul class="group-bars">
          {catalog.groups.map((g) => {
            const units = catalog.units.filter((u) => u.groupId === g.id);
            const d = units.filter((u) => progress.get(u.no)?.status === 'done').length;
            const avail = units.filter((u) => u.released).length;
            return (
              <li key={g.id}>
                <div class="lbl">
                  <span lang="en">{g.title}</span>
                  <b>
                    {d}/{units.length}
                  </b>
                </div>
                <div class="meter" aria-hidden="true">
                  <i style={{ width: `${(d / units.length) * 100}%` }} />
                </div>
                {avail === 0 && <div class="muted small" style={{ marginTop: 4 }}>Belum tersedia</div>}
              </li>
            );
          })}
        </ul>

        <h2 style={{ fontSize: 17, marginBottom: 6 }}>Skor per unit</h2>
        {scored.length === 0 ? (
          <p class="muted">Belum ada sesi latihan yang selesai. Skor muncul di sini setelah kamu menuntaskan satu sesi.</p>
        ) : (
          <table class="score-table">
            <thead>
              <tr>
                <th>Unit</th>
                <th class="num">Terbaik</th>
                <th class="num">Terakhir</th>
                <th class="num">Sesi</th>
              </tr>
            </thead>
            <tbody>
              {scored.map((u) => {
                const p = progress.get(u.no)!;
                return (
                  <tr key={u.no}>
                    <td>
                      <a href={`#/unit/${u.no}`} style={{ color: 'inherit' }}>
                        {u.no}
                      </a>
                      {p.status === 'done' && ' ✓'}
                    </td>
                    <td class="num">{pct(p.bestScore)}</td>
                    <td class="num">{pct(p.lastScore)}</td>
                    <td class="num">{p.sessions}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}
