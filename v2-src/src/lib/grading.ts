import type { FixQuestion, GapQuestion, MCQuestion, OrderQuestion } from './types';

/** Bentuk singkat yang maknanya pasti satu. 's dan 'd tidak diubah karena ambigu. */
const FIXED: [RegExp, string][] = [
  [/\bwon't\b/g, 'will not'],
  [/\bcan't\b/g, 'cannot'],
  [/\bcan not\b/g, 'cannot'],
  [/\bshan't\b/g, 'shall not'],
  [/\b(\w+)n't\b/g, '$1 not'],
  [/\b(i|you|we|they|who|there|these|those)'re\b/g, '$1 are'],
  [/\b(\w+)'ve\b/g, '$1 have'],
  [/\b(\w+)'ll\b/g, '$1 will'],
  [/\bi'm\b/g, 'i am']
];

/** Normalisasi jawaban ketikan: huruf kecil, apostrof lurus, spasi rapat, tanda baca ujung dibuang. */
export function normalize(input: string): string {
  let s = input
    .toLowerCase()
    .replace(/[‘’ʼ`´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[\s.,!?;:"]+|[\s.,!?;:"]+$/g, '')
    .replace(/\s+([,.!?;:])/g, '$1');
  for (const [re, rep] of FIXED) s = s.replace(re, rep);
  return s.replace(/\s+/g, ' ').trim();
}

export function matches(input: string, accept: string[]): boolean {
  const n = normalize(input);
  if (!n) return false;
  return accept.some((a) => normalize(a) === n);
}

export function gradeMC(q: MCQuestion, optionId: string | null): boolean {
  return optionId === q.answer;
}

export function gradeGap(q: GapQuestion, answers: string[]): { correct: boolean; perBlank: boolean[] } {
  const perBlank = q.blanks.map((b, i) => matches(answers[i] ?? '', b.accept));
  return { correct: perBlank.every(Boolean), perBlank };
}

/** Urutan kartu dibandingkan tanpa membedakan huruf besar/kecil, supaya keterangan waktu boleh di depan. */
export function gradeOrder(q: OrderQuestion, sequence: string[]): boolean {
  return q.accept.some(
    (acc) => acc.length === sequence.length && acc.every((t, i) => t.toLowerCase() === sequence[i].toLowerCase())
  );
}

export function gradeFix(
  q: FixQuestion,
  segmentIndex: number | null,
  text: string
): { correct: boolean; segmentOk: boolean; textOk: boolean } {
  const segmentOk = segmentIndex === q.errorIndex;
  const textOk = matches(text, q.accept);
  return { correct: segmentOk && textOk, segmentOk, textOk };
}

/** Kalimat gap dipecah menjadi teks dan nomor rumpang. */
export function splitGap(sentence: string): (string | number)[] {
  const parts: (string | number)[] = [];
  const re = /\{\{(\d+)\}\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sentence))) {
    if (m.index > last) parts.push(sentence.slice(last, m.index));
    parts.push(Number(m[1]) - 1);
    last = m.index + m[0].length;
  }
  if (last < sentence.length) parts.push(sentence.slice(last));
  return parts;
}

/** Fisher-Yates dengan generator yang bisa disuntik (untuk tes). */
export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

/** Acak kartu susun kata sampai tidak sama dengan salah satu jawaban. */
export function shuffleTokens(q: OrderQuestion, rand: () => number = Math.random): number[] {
  const idx = q.tokens.map((_, i) => i);
  if (q.tokens.length < 2) return idx;
  for (let tries = 0; tries < 30; tries++) {
    const s = shuffle(idx, rand);
    const seq = s.map((i) => q.tokens[i]);
    if (!gradeOrder(q, seq)) return s;
  }
  // Cadangan: putar satu posisi
  const s = idx.slice(1).concat(idx[0]);
  return s;
}
