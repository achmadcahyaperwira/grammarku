import { useEffect, useState } from 'preact/hooks';
import { loadQuestions, loadUnit } from '../lib/content';
import { allProgress, deleteReviewItems, finishSession, PASS_SCORE } from '../lib/db';
import { shuffle } from '../lib/grading';
import { pickDue } from '../lib/leitner';
import { go } from '../lib/router';
import { useApp, pct } from '../lib/store';
import { Session, questionPreview, answerText, type SessionItem } from '../components/Session';
import type { Answered } from '../components/QuestionView';
import type { Unit, UnitProgress } from '../lib/types';

function WrongList({ results, items }: { results: Answered[]; items: SessionItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const wrong = results.filter((r) => !r.correct);
  if (!wrong.length) return <p class="muted" style={{ textAlign: 'center' }}>Semua jawaban benar.</p>;
  return (
    <>
      <h2 style={{ fontSize: 17, margin: '8px 0 4px' }}>Soal yang salah ({wrong.length})</h2>
      <p class="muted small">Soal-soal ini sudah masuk bank kesalahan dan akan muncul lagi besok.</p>
      <ul class="wrong-list">
        {wrong.map((w) => {
          const it = items.find((x) => x.q.id === w.questionId)!;
          const isOpen = open === w.questionId;
          return (
            <li key={w.questionId}>
              <button aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : w.questionId)}>
                <span class="en" lang="en">
                  {questionPreview(it.q)}
                </span>
              </button>
              {isOpen && (
                <div class="why">
                  <b lang="en">{answerText(it.q)}</b>
                  <br />
                  {it.q.explanation}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function Practice({ unitNo }: { unitNo: number }) {
  const { refresh } = useApp();
  const [unit, setUnit] = useState<Unit | null | undefined>(undefined);
  const [items, setItems] = useState<SessionItem[]>([]);
  const [full, setFull] = useState(true);
  const [round, setRound] = useState(0);
  const [prog, setProg] = useState<UnitProgress | null>(null);
  const [prevStatus, setPrevStatus] = useState<string | null>(null);

  useEffect(() => {
    loadUnit(unitNo)
      .then((u) => {
        setUnit(u);
        if (u) setItems(shuffle(u.questions).map((q) => ({ q, unitNo })));
      })
      .catch(() => setUnit(null));
  }, [unitNo]);

  if (unit === undefined) return <div class="loading">Memuat soal…</div>;
  if (!unit)
    return (
      <div class="empty page">
        <p>Soal unit ini belum tersedia.</p>
        <a class="btn secondary" href="#/unit">
          Kembali ke daftar unit
        </a>
      </div>
    );

  return (
    <Session
      key={round}
      title={`Latihan Unit ${unitNo}${full ? '' : ': ulangi yang salah'}`}
      items={items}
      mode="practice"
      onExit={() => go(`/unit/${unitNo}`)}
      onFinish={async (results) => {
        const correct = results.filter((r) => r.correct).length;
        setPrevStatus((await allProgress()).get(unitNo)?.status ?? 'new');
        const p = await finishSession(unitNo, correct, results.length, full);
        setProg(p);
        await refresh();
      }}
      renderSummary={(results, its) => {
        const correct = results.filter((r) => r.correct).length;
        const score = results.length ? correct / results.length : 0;
        const wrongQs = its.filter((it) => results.some((r) => r.questionId === it.q.id && !r.correct));
        const newlyDone = prog?.status === 'done' && prevStatus !== 'done';
        return (
          <>
            <div class="score">
              <div class="big">{pct(score)}</div>
              <div class="of">
                {correct} dari {results.length} benar
              </div>
              {full && prog && (
                <div class={`stamp ${prog.status === 'done' ? 'done' : 'learning'}`}>
                  {newlyDone ? 'Unit selesai' : prog.status === 'done' ? 'Sudah selesai' : `Butuh ${Math.round(PASS_SCORE * 100)}% untuk selesai`}
                </div>
              )}
              {!full && <p class="muted small" style={{ marginTop: 10 }}>Putaran ulang tidak mengubah skor unit.</p>}
            </div>
            <WrongList results={results} items={its} />
            <div class="btn-row" style={{ flexDirection: 'column' }}>
              {wrongQs.length > 0 && (
                <button
                  class="btn block"
                  onClick={() => {
                    setItems(shuffle(wrongQs));
                    setFull(false);
                    setRound(round + 1);
                  }}
                >
                  Ulangi yang salah ({wrongQs.length})
                </button>
              )}
              <a class={`btn block ${wrongQs.length ? 'secondary' : ''}`} href={`#/unit/${unitNo}`}>
                Kembali ke unit
              </a>
            </div>
          </>
        );
      }}
    />
  );
}

export function Review() {
  const { review, today, refresh } = useApp();
  const [items, setItems] = useState<SessionItem[] | null>(null);

  useEffect(() => {
    (async () => {
      const due = pickDue(review, today, 20);
      const qs = await loadQuestions(due.map((d) => d.unitNo));
      const orphans = due.filter((d) => !qs.has(d.questionId)).map((d) => d.questionId);
      await deleteReviewItems(orphans);
      setItems(
        due
          .filter((d) => qs.has(d.questionId))
          .map((d) => ({ q: qs.get(d.questionId)!.q, unitNo: d.unitNo, meta: `Unit ${d.unitNo}, kotak ${d.box}` }))
      );
    })();
  }, []);

  if (!items) return <div class="loading">Menyiapkan ulangan…</div>;
  if (!items.length)
    return (
      <div class="page empty">
        <p>Tidak ada soal yang jatuh tempo hari ini.</p>
        <a class="btn secondary" href="#/">
          Kembali ke Beranda
        </a>
      </div>
    );

  return (
    <Session
      title="Ulangan bank kesalahan"
      items={items}
      mode="review"
      onExit={() => go('/review')}
      onFinish={async () => {
        await refresh();
      }}
      renderSummary={(results, its) => {
        const correct = results.filter((r) => r.correct).length;
        return (
          <>
            <div class="score">
              <div class="big">
                {correct}/{results.length}
              </div>
              <div class="of">soal ulangan benar</div>
              <p class="muted small" style={{ marginTop: 10 }}>
                Soal yang benar naik satu kotak dan muncul lagi lebih lama. Yang salah kembali ke kotak 1.
              </p>
            </div>
            <WrongList results={results} items={its} />
            <a class="btn block" href="#/">
              Kembali ke Beranda
            </a>
          </>
        );
      }}
    />
  );
}
