import { useApp } from '../lib/store';
import { pickDue } from '../lib/leitner';
import { DAILY_TARGET } from '../lib/streak';
import { IconGear, StatusMark } from '../components/icons';

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export function Home() {
  const { catalog, progress, review, streak, today, lastUnit } = useApp();
  const now = new Date();
  const due = pickDue(review, today, 999).length;
  const done = [...progress.values()].filter((p) => p.status === 'done').length;
  const total = catalog.units.length;
  const todayN = streak.todayAnswers;
  const reached = todayN >= DAILY_TARGET;

  const cont = lastUnit ? catalog.units.find((u) => u.no === lastUnit) : catalog.units.find((u) => u.released && progress.get(u.no)?.status !== 'done');
  const contProg = cont ? progress.get(cont.no) : undefined;

  return (
    <>
      <header class="topbar">
        <div class="title">Cay's English V2</div>
        <a class="icon-btn" href="#/settings" aria-label="Pengaturan">
          <IconGear />
        </a>
      </header>
      <main class="page">
        <div class="hello">
          <p class="muted small" style={{ margin: 0 }}>
            {DAYS[now.getDay()]}, {now.getDate()} {MONTHS[now.getMonth()]}
          </p>
          <h1>Belajar hari ini</h1>
        </div>

        <section class="streak" aria-label="Streak harian">
          <div class="streak-num">{streak.current}</div>
          <div>
            <b>{streak.current ? 'hari berturut-turut' : 'Belum ada streak'}</b>
            <div class="muted small">
              {reached
                ? `Target hari ini tercapai: ${todayN} jawaban.`
                : `Hari ini ${todayN} dari ${DAILY_TARGET} jawaban${streak.current ? ' supaya streak tidak putus' : ''}.`}
            </div>
          </div>
          <div class="meter" style={{ gridColumn: '2' }} aria-hidden="true">
            <i style={{ width: `${Math.min(100, (todayN / DAILY_TARGET) * 100)}%` }} />
          </div>
        </section>

        <section class={'card' + (due ? ' due' : '')}>
          <h2>Ulangan hari ini</h2>
          {due ? (
            <>
              <p class="muted" style={{ margin: 0 }}>
                {due} soal yang pernah salah sudah waktunya diulang.
              </p>
              <a class="btn block" href="#/review/start">
                Mulai ulangan
              </a>
            </>
          ) : (
            <p class="muted" style={{ margin: 0 }}>
              Tidak ada ulangan hari ini.
              {review.length ? ` Bank kesalahan berisi ${review.length} soal dengan jadwal berikutnya.` : ' Soal yang kamu jawab salah akan muncul di sini.'}
            </p>
          )}
        </section>

        {cont && (
          <section class="card">
            <p class="muted small" style={{ margin: '0 0 4px' }}>
              {lastUnit ? 'Terakhir dibuka' : 'Mulai dari sini'}
            </p>
            <h2>
              Unit {cont.no}: <span lang="en">{cont.title}</span>
            </h2>
            {contProg && contProg.status !== 'new' && (
              <div class="status">
                <StatusMark status={contProg.status} />
                {contProg.status === 'done' ? 'Selesai' : 'Sedang dipelajari'}
                {contProg.bestScore != null && `, skor terbaik ${Math.round(contProg.bestScore * 100)}%`}
              </div>
            )}
            <a class="btn block secondary" href={`#/unit/${cont.no}`}>
              {lastUnit ? 'Lanjutkan unit' : 'Buka Unit ' + cont.no}
            </a>
          </section>
        )}

        <a class="card" href="#/progress">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <b>Unit selesai</b>
            <b>
              {done}/{total}
            </b>
          </div>
          <div class="meter" aria-hidden="true">
            <i style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <p class="muted small" style={{ margin: '8px 0 0' }}>
            {catalog.units.filter((u) => u.released).length} unit sudah tersedia. Unit lain menyusul bertahap.
          </p>
        </a>
      </main>
    </>
  );
}
