import { useEffect, useState } from 'preact/hooks';
import { loadUnit } from '../lib/content';
import { touchUnit } from '../lib/db';
import { back } from '../lib/router';
import { rich, useApp, pct } from '../lib/store';
import { IconBack, StatusMark } from '../components/icons';
import type { Unit } from '../lib/types';

export function Lesson({ unitNo }: { unitNo: number }) {
  const { catalog, progress, refresh } = useApp();
  const [unit, setUnit] = useState<Unit | null | undefined>(undefined);
  const cu = catalog.units.find((u) => u.no === unitNo);
  const group = catalog.groups.find((g) => g.id === cu?.groupId);
  const p = progress.get(unitNo);

  useEffect(() => {
    let alive = true;
    loadUnit(unitNo)
      .then((u) => {
        if (!alive) return;
        setUnit(u);
        if (u) touchUnit(unitNo).then(refresh);
      })
      .catch(() => alive && setUnit(null));
    return () => {
      alive = false;
    };
  }, [unitNo]);

  return (
    <>
      <header class="topbar">
        <button class="icon-btn" aria-label="Kembali" onClick={() => back('#/unit')}>
          <IconBack />
        </button>
        <div class="title">Unit {unitNo}</div>
      </header>
      <main class="page">
        {unit === undefined && <div class="loading">Memuat materi…</div>}
        {unit === null && (
          <div class="empty">
            <p>{cu && !cu.released ? 'Materi unit ini sedang disiapkan dan akan tersedia di tahap berikutnya.' : 'Unit ini tidak ditemukan.'}</p>
            <a class="btn secondary" href="#/unit">
              Kembali ke daftar unit
            </a>
          </div>
        )}
        {unit && (
          <>
            <div class="unit-head">
              <div class="kicker" lang="en">
                {group?.title}
              </div>
              <h1 lang="en">{unit.title}</h1>
              <div class="status">
                <StatusMark status={p?.status ?? 'new'} />
                {p?.status === 'done' ? 'Selesai' : p?.status === 'learning' ? 'Sedang dipelajari' : 'Belum mulai'}
                {p?.bestScore != null && `, skor terbaik ${pct(p.bestScore)}`}
                {p?.lastScore != null && p.sessions > 1 && `, terakhir ${pct(p.lastScore)}`}
              </div>
            </div>

            <section class="sheet lesson-text">
              <h2>Penjelasan</h2>
              {unit.lesson.summary.split(/\n\s*\n/).map((para, i) => (
                <p key={i}>{rich(para)}</p>
              ))}
            </section>

            <section class="sheet">
              <h2>Pola</h2>
              {unit.lesson.patterns.map((f, i) => (
                <div class="formula" key={i}>
                  <span class="f" lang="en">
                    {f.formula}
                  </span>
                  <span class="ex en" lang="en">
                    {f.example}
                  </span>
                </div>
              ))}
            </section>

            <section class="sheet">
              <h2>Contoh</h2>
              <ul class="examples">
                {unit.lesson.examples.map((ex, i) => (
                  <li key={i}>
                    <span class="en" lang="en">
                      {ex.en}
                    </span>
                    <span class="tr">{ex.id}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section class="sheet">
              <h2>Kesalahan umum</h2>
              {unit.lesson.commonMistakes.map((m, i) => (
                <div class="mistake" key={i}>
                  <div class="wrong">
                    <span class="sym" aria-label="Salah">
                      ✗
                    </span>
                    <span class="en" lang="en">
                      {m.wrong}
                    </span>
                  </div>
                  <div class="right">
                    <span class="sym" aria-label="Benar">
                      ✓
                    </span>
                    <span class="en" lang="en">
                      {m.right}
                    </span>
                  </div>
                  <p class="why">{rich(m.why)}</p>
                </div>
              ))}
            </section>

            <div class="sticky-action">
              <a class="btn block" href={`#/practice/${unitNo}`}>
                Mulai latihan ({unit.questions.length} soal)
              </a>
            </div>
          </>
        )}
      </main>
    </>
  );
}
