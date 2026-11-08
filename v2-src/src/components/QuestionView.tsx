import { Fragment } from 'preact';
import { useMemo, useRef, useState, useEffect } from 'preact/hooks';
import { gradeFix, gradeGap, gradeMC, gradeOrder, shuffle, shuffleTokens, splitGap } from '../lib/grading';
import { recordAnswer } from '../lib/db';
import { joinTokens } from '../lib/store';
import type { FixQuestion, GapQuestion, MCQuestion, Mode, OrderQuestion, Question } from '../lib/types';
import { IconCheck, IconCross } from './icons';

export interface Answered {
  correct: boolean;
  questionId: string;
}

interface Props {
  q: Question;
  unitNo: number;
  mode: Mode;
  sessionId: string;
  meta?: string;
  isLast: boolean;
  onAnswered: (a: Answered) => void;
  onNext: () => void;
}

interface Result {
  correct: boolean;
  answerText: string;
  extra?: string;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function QuestionView({ q, unitNo, mode, sessionId, meta, isLast, onAnswered, onNext }: Props) {
  const [result, setResult] = useState<Result | null>(null);
  const [saving, setSaving] = useState(false);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (result) nextRef.current?.focus({ preventScroll: true });
  }, [result]);

  async function submit(correct: boolean, response: unknown, answerText: string, extra?: string) {
    if (result || saving) return;
    setSaving(true);
    setResult({ correct, answerText, extra });
    try {
      await recordAnswer({ questionId: q.id, unitNo, mode, correct, response, sessionId });
    } finally {
      setSaving(false);
      onAnswered({ correct, questionId: q.id });
    }
  }

  return (
    <div class="question" data-qid={q.id} data-type={q.type}>
      {meta && <div class="q-meta">{meta}</div>}
      <div class="q-instr">{q.instruction}</div>
      {q.type === 'mc' && <MC q={q} result={result} onSubmit={submit} />}
      {q.type === 'gap' && <Gap q={q} result={result} onSubmit={submit} />}
      {q.type === 'order' && <Order q={q} result={result} onSubmit={submit} />}
      {q.type === 'fix' && <Fix q={q} result={result} onSubmit={submit} />}
      {result && (
        <div class={`feedback ${result.correct ? 'ok' : 'bad'}`} role="status">
          <div class="verdict">
            {result.correct ? <IconCheck /> : <IconCross />}
            {result.correct ? 'Benar' : 'Belum tepat'}
          </div>
          {!result.correct && (
            <div class="answer">
              Jawaban yang benar: <b lang="en">{result.answerText}</b>
            </div>
          )}
          {result.extra && <div class="opt-why">{result.extra}</div>}
          <p class="why">{q.explanation}</p>
          <div class="qid">ID soal: {q.id}</div>
          <button ref={nextRef} class="btn block" onClick={onNext} disabled={saving}>
            {isLast ? 'Lihat hasil' : 'Lanjut'}
          </button>
        </div>
      )}
    </div>
  );
}

type Submit = (correct: boolean, response: unknown, answerText: string, extra?: string) => void;

function CheckBar({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <div class="sticky-action">
      <button class="btn block" disabled={disabled} onClick={onClick}>
        Periksa
      </button>
    </div>
  );
}

function MC({ q, result, onSubmit }: { q: MCQuestion; result: Result | null; onSubmit: Submit }) {
  const order = useMemo(() => shuffle(q.options), [q.id]);
  const [sel, setSel] = useState<string | null>(null);
  const right = q.options.find((o) => o.id === q.answer)!;
  const check = () => {
    if (!sel) return;
    const ok = gradeMC(q, sel);
    const chosen = q.options.find((o) => o.id === sel)!;
    onSubmit(ok, sel, right.text, ok ? undefined : `Kenapa “${chosen.text}” kurang tepat: ${chosen.why}`);
  };
  return (
    <>
      <p class="q-sentence" lang="en">
        {q.sentence.split('___').map((part, i, arr) => (
          <Fragment key={i}>
            {part}
            {i < arr.length - 1 && <span aria-label="bagian kosong">_____</span>}
          </Fragment>
        ))}
      </p>
      <div class="options" role="group" aria-label="Pilihan jawaban">
        {order.map((o, i) => {
          let cls = 'option';
          if (result && o.id === q.answer) cls += ' is-right';
          else if (result && o.id === sel) cls += ' is-wrong';
          return (
            <button
              key={o.id}
              data-opt={o.id}
              class={cls}
              aria-pressed={sel === o.id}
              disabled={!!result}
              onClick={() => setSel(o.id)}
              lang="en"
            >
              <span class="key" aria-hidden="true">
                {LETTERS[i]}
              </span>
              {o.text}
            </button>
          );
        })}
      </div>
      {!result && <CheckBar disabled={!sel} onClick={check} />}
    </>
  );
}

function Gap({ q, result, onSubmit }: { q: GapQuestion; result: Result | null; onSubmit: Submit }) {
  const parts = useMemo(() => splitGap(q.sentence), [q.id]);
  const [vals, setVals] = useState<string[]>(() => q.blanks.map(() => ''));
  const [per, setPer] = useState<boolean[] | null>(null);
  const first = useRef<HTMLInputElement>(null);
  useEffect(() => first.current?.focus({ preventScroll: true }), [q.id]);
  const filled = vals.every((v) => v.trim());
  const check = () => {
    if (!filled) return;
    const g = gradeGap(q, vals);
    setPer(g.perBlank);
    const full = parts.map((p) => (typeof p === 'number' ? q.blanks[p].accept[0] : p)).join('');
    onSubmit(g.correct, vals, full);
  };
  return (
    <>
      <p class="q-sentence" lang="en">
        {parts.map((p, i) => {
          if (typeof p === 'string') return <span key={i}>{p}</span>;
          const longest = Math.max(4, ...q.blanks[p].accept.map((a) => a.length));
          const cls = 'gap-input' + (per ? (per[p] ? ' is-right' : ' is-wrong') : '');
          return (
            <span key={i}>
              {q.blanks.length > 1 && <span class="gap-n">{p + 1}</span>}
              <input
                ref={p === 0 ? first : undefined}
                class={cls}
                style={{ width: `${longest + 2}ch` }}
                value={vals[p]}
                disabled={!!result}
                aria-label={`Bagian kosong ${p + 1}${q.blanks[p].hint ? `, petunjuk: ${q.blanks[p].hint}` : ''}`}
                autocomplete="off"
                autocapitalize="off"
                autocorrect="off"
                spellcheck={false}
                enterkeyhint="done"
                onInput={(e) => {
                  const v = [...vals];
                  v[p] = (e.target as HTMLInputElement).value;
                  setVals(v);
                }}
                onKeyDown={(e) => e.key === 'Enter' && check()}
              />
              {q.blanks[p].hint && <span class="muted small"> ({q.blanks[p].hint})</span>}
            </span>
          );
        })}
      </p>
      {!result && <CheckBar disabled={!filled} onClick={check} />}
    </>
  );
}

function Order({ q, result, onSubmit }: { q: OrderQuestion; result: Result | null; onSubmit: Submit }) {
  const bankOrder = useMemo(() => shuffleTokens(q), [q.id]);
  const [picked, setPicked] = useState<number[]>([]);
  const [ok, setOk] = useState<boolean | null>(null);
  const done = picked.length === q.tokens.length;
  const check = () => {
    if (!done) return;
    const seq = picked.map((i) => q.tokens[i]);
    const g = gradeOrder(q, seq);
    setOk(g);
    onSubmit(g, seq, joinTokens(q.accept[0]));
  };
  return (
    <>
      {q.hint && <p class="q-hint">Artinya: {q.hint}</p>}
      <div
        class={'answer-line' + (picked.length ? '' : ' empty-line') + (ok == null ? '' : ok ? ' is-right' : ' is-wrong')}
        aria-label="Kalimat yang sedang disusun"
      >
        {picked.map((ti, pi) => (
          <button
            key={`${ti}-${pi}`}
            class="tok"
            lang="en"
            disabled={!!result}
            onClick={() => setPicked(picked.filter((_, j) => j !== pi))}
            aria-label={`${q.tokens[ti]}, ketuk untuk mengembalikan`}
          >
            {q.tokens[ti]}
          </button>
        ))}
      </div>
      <div class="bank" aria-label="Kata yang tersedia">
        {bankOrder.map((ti) => (
          <button
            key={ti}
            class={'tok' + (picked.includes(ti) ? ' used' : '')}
            lang="en"
            disabled={!!result || picked.includes(ti)}
            onClick={() => setPicked([...picked, ti])}
          >
            {q.tokens[ti]}
          </button>
        ))}
      </div>
      {!result && <CheckBar disabled={!done} onClick={check} />}
    </>
  );
}

function Fix({ q, result, onSubmit }: { q: FixQuestion; result: Result | null; onSubmit: Submit }) {
  const [seg, setSeg] = useState<number | null>(null);
  const [text, setText] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const ready = seg !== null && text.trim().length > 0;
  const check = () => {
    if (!ready) return;
    const g = gradeFix(q, seg, text);
    let extra: string | undefined;
    if (!g.segmentOk) extra = `Bagian yang salah adalah “${q.segments[q.errorIndex]}”, bukan “${q.segments[seg!]}”.`;
    else if (!g.textOk) extra = `Bagiannya sudah tepat, tetapi perbaikannya belum. Yang benar: “${q.accept[0]}”.`;
    onSubmit(g.correct, { segment: seg, text }, q.corrected, extra);
  };
  return (
    <>
      <p class="segments" lang="en">
        {q.segments.map((s, i) => {
          let cls = 'seg';
          if (result && i === q.errorIndex) cls += ' is-error';
          return (
            <Fragment key={i}>
              <button
                class={cls}
                aria-pressed={seg === i}
                disabled={!!result}
                onClick={() => {
                  setSeg(i);
                  setText(s);
                  setTimeout(() => {
                    input.current?.focus({ preventScroll: true });
                    input.current?.select();
                  }, 0);
                }}
              >
                {s}
              </button>{' '}
            </Fragment>
          );
        })}
      </p>
      {seg !== null && (
        <div class="fix-field">
          <label for={`fix-${q.id}`}>
            Ganti “<span lang="en">{q.segments[seg]}</span>” menjadi:
          </label>
          <input
            id={`fix-${q.id}`}
            ref={input}
            lang="en"
            value={text}
            disabled={!!result}
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            spellcheck={false}
            enterkeyhint="done"
            onInput={(e) => setText((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => e.key === 'Enter' && check()}
          />
        </div>
      )}
      {seg === null && !result && <p class="muted small">Langkah 1: ketuk bagian kalimat yang salah.</p>}
      {!result && <CheckBar disabled={!ready} onClick={check} />}
    </>
  );
}
