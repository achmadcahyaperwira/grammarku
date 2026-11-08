import { addDays } from './dates';
import type { ReviewItem } from './types';

/** Jeda (hari) untuk kotak 1 sampai 5. */
export const INTERVALS = [1, 3, 7, 14, 30];
export const MAX_BOX = INTERVALS.length;

/** Jawaban salah (latihan atau ulangan): soal masuk atau kembali ke kotak 1, jatuh tempo besok. */
export function onWrong(
  existing: ReviewItem | undefined,
  questionId: string,
  unitNo: number,
  today: string
): ReviewItem {
  return {
    questionId,
    unitNo,
    box: 1,
    dueDate: addDays(today, INTERVALS[0]),
    lapses: (existing?.lapses ?? 0) + 1,
    addedAt: existing?.addedAt ?? today,
    lastReviewedAt: existing ? today : null
  };
}

/** Jawaban benar saat ulangan: naik satu kotak. Benar di kotak 5 = dikuasai (null = keluar dari bank). */
export function onReviewCorrect(item: ReviewItem, today: string): ReviewItem | null {
  if (item.box >= MAX_BOX) return null;
  const box = item.box + 1;
  return { ...item, box, dueDate: addDays(today, INTERVALS[box - 1]), lastReviewedAt: today };
}

export function isDue(item: ReviewItem, today: string): boolean {
  return item.dueDate <= today;
}

/** Urutkan dari jatuh tempo paling lama, ambil maksimal `limit`. */
export function pickDue(items: ReviewItem[], today: string, limit = 20): ReviewItem[] {
  return items
    .filter((i) => isDue(i, today))
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : a.box - b.box))
    .slice(0, limit);
}
