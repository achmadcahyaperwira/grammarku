import { useMemo, useState } from 'preact/hooks';
import { QuestionView, type Answered } from './QuestionView';
import { IconClose } from './icons';
import type { Mode, Question } from '../lib/types';
import { joinTokens } from '../lib/store';

export interface SessionItem {
  q: Question;
  unitNo: number;
  meta?: string;
}

interface Props {
  title: string;
  items: SessionItem[];
  mode: Mode;
  onExit: () => void;
  /** Dipanggil sekali saat soal terakhir selesai; mengembalikan isi ringkasan tambahan. */
  onFinish: (results: Answered[]) => Promise<void> | void;
  renderSummary: (results: Answered[], items: SessionItem[]) => preact.ComponentChildren;
}

export function questionPreview(q: Question): string {
  switch (q.type) {
    case 'mc':
      return q.sentence.replace(/___/g, '…');
    case 'gap':
      return q.sentence.replace(/\{\{\d+\}\}/g, '…');
    case 'order':
      return q.hint ? `Susun: ${q.hint}` : joinTokens(q.tokens);
    case 'fix':
      return 'Perbaiki: ' + q.segments.join(' ').replace(/\s+([?.!,;:])/g, '$1');
  }
}

/** Jawaban benar dalam bentuk kalimat, untuk ditampilkan di ringkasan dan bank kesalahan. */
export function answerText(q: Question): string {
  switch (q.type) {
    case 'mc':
      return q.sentence.includes('___') ? q.sentence.replace('___', q.options.find((o) => o.id === q.answer)!.text) : q.options.find((o) => o.id === q.answer)!.text;
    case 'gap':
      return q.sentence.replace(/\{\{(\d+)\}\}/g, (_, n) => q.blanks[Number(n) - 1].accept[0]);
    case 'order':
      return joinTokens(q.accept[0]);
    case 'fix':
      return q.corrected;
  }
}

export function Session({ title, items, mode, onExit, onFinish, renderSummary }: Props) {
  const sessionId = useMemo(() => `s-${Date.now().toString(36)}`, [items]);
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Answered[]>([]);
  const [finished, setFinished] = useState(false);
  const item = items[i];

  const answered = (a: Answered) => setResults((r) => [...r, a]);

  async function next() {
    if (i < items.length - 1) {
      setI(i + 1);
      window.scrollTo(0, 0);
    } else {
      await onFinish(results);
      setFinished(true);
      window.scrollTo(0, 0);
    }
  }

  return (
    <div class="app no-tabs">
      <header class="topbar">
        <button class="icon-btn" aria-label="Keluar dari sesi" onClick={onExit}>
          <IconClose />
        </button>
        <div class="title">{title}</div>
      </header>
      <main class="page">
        {finished ? (
          renderSummary(results, items)
        ) : (
          <>
            <div class="progress-strip" aria-label={`Soal ${i + 1} dari ${items.length}`}>
              <div class="meter" aria-hidden="true">
                <i style={{ width: `${(i / items.length) * 100}%` }} />
              </div>
              <span class="count">
                {i + 1}/{items.length}
              </span>
            </div>
            <QuestionView
              key={`${item.q.id}-${i}`}
              q={item.q}
              unitNo={item.unitNo}
              mode={mode}
              sessionId={sessionId}
              meta={item.meta}
              isLast={i === items.length - 1}
              onAnswered={answered}
              onNext={next}
            />
          </>
        )}
      </main>
    </div>
  );
}
