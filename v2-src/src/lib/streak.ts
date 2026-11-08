import { addDays } from './dates';
import type { DailyActivity } from './types';

export const DAILY_TARGET = 10;

export interface Streak {
  current: number;
  longest: number;
  todayAnswers: number;
  lastActiveDate: string | null;
}

/**
 * Hari aktif = minimal DAILY_TARGET jawaban pada tanggal lokal.
 * Streak saat ini dihitung mundur dari hari ini; kalau hari ini belum aktif,
 * streak kemarin masih dihitung (belum putus sampai hari ini lewat).
 */
export function computeStreak(days: DailyActivity[], today: string, target = DAILY_TARGET): Streak {
  const active = new Set(days.filter((d) => d.answers >= target).map((d) => d.localDate));
  const todayAnswers = days.find((d) => d.localDate === today)?.answers ?? 0;

  let current = 0;
  let cursor = active.has(today) ? today : addDays(today, -1);
  while (active.has(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }

  const sorted = [...active].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    if (run > longest) longest = run;
    prev = d;
  }

  return { current, longest, todayAnswers, lastActiveDate: sorted.at(-1) ?? null };
}
