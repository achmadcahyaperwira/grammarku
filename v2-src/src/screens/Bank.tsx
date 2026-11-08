import { useEffect, useState } from 'preact/hooks';
import { loadQuestions } from '../lib/content';
import { relativeDay } from '../lib/dates';
import { MAX_BOX, pickDue } from '../lib/leitner';
import { useApp } from '../lib/store';
import { questionPreview, answerText } from '../components/Session';
import type { Question } from '../lib/types';

export function Bank() {
  const { review, today, catalog } = useApp();
  const [qs, setQs] = useState<Map<string, { q: Question }> | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const due = pickDue(review, today, 999).length;

  useEffect(() => {
    loadQuestions(review.map((r) => r.unitNo)).then(setQs);
  }, [review]);

  const units = [...new Set(review.map((r) => r.unitNo))].sort((a, b) => a - b);

  return (
    <>
      <header class="topbar">
        <div class="title">Bank kesalahan</div>
      </header>
      <main class="page">
        <section class={'card' + (due ? ' due' : '')}>
          <h2>{due ? `${due} soal jatuh tempo` : 'Tidak ada ulangan hari ini'}</h2>
          <p class="muted small" style={{ margin: 0 }}>
            Soal yang salah masuk kotak 1. Setiap jawaban benar saat ulangan menaikkan soal satu kotak, dengan jeda 1, 3, 7, 14, lalu 30
            hari. Benar di kotak 5 berarti dikuasai, dan soal keluar dari bank.
          </p>
          {due > 0 && (
            <a class="btn block" href="#/review/start">
              Mulai ulangan{due > 20 ? ' (20 soal)' : ''}
            </a>
          )}
        </section>

        {review.length === 0 ? (
          <p class="muted empty">Bank kesalahan masih kosong. Soal yang kamu jawab salah saat latihan akan tercatat di sini.</p>
        ) : (
          units.map((no) => {
            const cu = catalog.units.find((u) => u.no === no);
            const its = review.filter((r) => r.unitNo === no).sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
            return (
              <section class="unit-group" key={no}>
                <h3>
                  Unit {no}: <span lang="en">{cu?.title}</span>
                </h3>
                {its.map((r) => {
                  const q = qs?.get(r.questionId)?.q;
                  const isOpen = open === r.questionId;
                  return (
                    <div class="bank-item" key={r.questionId}>
                      <button aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : r.questionId)}>
                        <span class="row">
                          <span>
                            <span class="boxes" aria-label={`Kotak ${r.box} dari ${MAX_BOX}`}>
                              {Array.from({ length: MAX_BOX }, (_, i) => (
                                <i key={i} class={i < r.box ? 'on' : ''} />
                              ))}
                            </span>{' '}
                            kotak {r.box}
                          </span>
                          <span>{r.dueDate <= today ? 'jatuh tempo' : relativeDay(r.dueDate, today)}</span>
                        </span>
                        <span class="txt" lang="en">
                          {q ? questionPreview(q) : r.questionId}
                        </span>
                      </button>
                      {isOpen && q && (
                        <div class="why">
                          <b lang="en">{answerText(q)}</b>
                          <br />
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            );
          })
        )}
      </main>
    </>
  );
}
