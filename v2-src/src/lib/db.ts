import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { localDate } from './dates';
import { onReviewCorrect, onWrong } from './leitner';
import { computeStreak, type Streak } from './streak';
import type { Attempt, DailyActivity, MetaRow, Mode, ReviewItem, UnitProgress } from './types';

export const DB_NAME = 'cays-english-v2';
export const DB_VERSION = 1;
export const STORES = ['unitProgress', 'attempts', 'reviewItems', 'dailyActivity', 'meta'] as const;

interface Schema extends DBSchema {
  unitProgress: { key: number; value: UnitProgress };
  attempts: { key: number; value: Attempt; indexes: { byQuestion: string } };
  reviewItems: { key: string; value: ReviewItem; indexes: { byDue: string } };
  dailyActivity: { key: string; value: DailyActivity };
  meta: { key: string; value: MetaRow };
}

let dbp: Promise<IDBPDatabase<Schema>> | null = null;

export function db(): Promise<IDBPDatabase<Schema>> {
  if (!dbp) {
    dbp = openDB<Schema>(DB_NAME, DB_VERSION, {
      upgrade(d) {
        d.createObjectStore('unitProgress', { keyPath: 'unitNo' });
        const a = d.createObjectStore('attempts', { keyPath: 'id', autoIncrement: true });
        a.createIndex('byQuestion', 'questionId');
        const r = d.createObjectStore('reviewItems', { keyPath: 'questionId' });
        r.createIndex('byDue', 'dueDate');
        d.createObjectStore('dailyActivity', { keyPath: 'localDate' });
        d.createObjectStore('meta', { keyPath: 'key' });
      }
    });
  }
  return dbp;
}

/** Hanya untuk tes: tutup dan lupakan koneksi. */
export async function resetConnection(): Promise<void> {
  if (dbp) (await dbp).close();
  dbp = null;
}

export function emptyProgress(unitNo: number): UnitProgress {
  return { unitNo, status: 'new', lastScore: null, bestScore: null, sessions: 0, completedAt: null, lastOpenedAt: null };
}

export interface AnswerInput {
  questionId: string;
  unitNo: number;
  mode: Mode;
  correct: boolean;
  response: unknown;
  sessionId: string;
  now?: Date;
}

export interface AnswerResult {
  review: ReviewItem | null;
  /** true bila soal baru saja dikuasai dan keluar dari bank */
  mastered: boolean;
  daily: DailyActivity;
}

/** Catat satu jawaban: riwayat, aktivitas harian, bank kesalahan, dan status unit, dalam satu transaksi. */
export async function recordAnswer(input: AnswerInput): Promise<AnswerResult> {
  const d = await db();
  const now = input.now ?? new Date();
  const today = localDate(now);
  const tx = d.transaction(['attempts', 'dailyActivity', 'reviewItems', 'unitProgress'], 'readwrite');

  await tx.objectStore('attempts').add({
    questionId: input.questionId,
    unitNo: input.unitNo,
    mode: input.mode,
    correct: input.correct,
    response: input.response,
    localDate: today,
    answeredAt: now.toISOString(),
    sessionId: input.sessionId
  });

  const dayStore = tx.objectStore('dailyActivity');
  const day = (await dayStore.get(today)) ?? { localDate: today, answers: 0, correct: 0 };
  day.answers += 1;
  if (input.correct) day.correct += 1;
  await dayStore.put(day);

  const rs = tx.objectStore('reviewItems');
  const existing = await rs.get(input.questionId);
  let review: ReviewItem | null = existing ?? null;
  let mastered = false;
  if (!input.correct) {
    review = onWrong(existing, input.questionId, input.unitNo, today);
    await rs.put(review);
  } else if (existing && input.mode === 'review') {
    review = onReviewCorrect(existing, today);
    if (review) await rs.put(review);
    else {
      await rs.delete(input.questionId);
      mastered = true;
    }
  }

  if (input.mode === 'practice') {
    const ups = tx.objectStore('unitProgress');
    const p = (await ups.get(input.unitNo)) ?? emptyProgress(input.unitNo);
    if (p.status === 'new') {
      p.status = 'learning';
      await ups.put(p);
    }
  }

  await tx.done;
  return { review, mastered, daily: day };
}

export const PASS_SCORE = 0.7;

/** Selesaikan sesi latihan. `full` = sesi berisi semua soal unit. Status Selesai tidak pernah turun. */
export async function finishSession(unitNo: number, correct: number, total: number, full: boolean, now = new Date()): Promise<UnitProgress> {
  const d = await db();
  const tx = d.transaction('unitProgress', 'readwrite');
  const p = (await tx.store.get(unitNo)) ?? emptyProgress(unitNo);
  const score = total ? correct / total : 0;
  if (full) {
    p.sessions += 1;
    p.lastScore = score;
    p.bestScore = p.bestScore == null ? score : Math.max(p.bestScore, score);
    if (score >= PASS_SCORE && p.status !== 'done') {
      p.status = 'done';
      p.completedAt = now.toISOString();
    }
  }
  if (p.status === 'new') p.status = 'learning';
  await tx.store.put(p);
  await tx.done;
  return p;
}

export async function touchUnit(unitNo: number): Promise<void> {
  const d = await db();
  const tx = d.transaction(['unitProgress', 'meta'], 'readwrite');
  const ups = tx.objectStore('unitProgress');
  const p = (await ups.get(unitNo)) ?? emptyProgress(unitNo);
  p.lastOpenedAt = new Date().toISOString();
  await ups.put(p);
  await tx.objectStore('meta').put({ key: 'lastUnit', value: unitNo });
  await tx.done;
}

export async function allProgress(): Promise<Map<number, UnitProgress>> {
  const rows = await (await db()).getAll('unitProgress');
  return new Map(rows.map((r) => [r.unitNo, r]));
}

export async function allReviewItems(): Promise<ReviewItem[]> {
  return (await db()).getAll('reviewItems');
}

export async function deleteReviewItems(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const tx = (await db()).transaction('reviewItems', 'readwrite');
  for (const id of ids) await tx.store.delete(id);
  await tx.done;
}

export async function allDaily(): Promise<DailyActivity[]> {
  return (await db()).getAll('dailyActivity');
}

export async function getStreak(today = localDate()): Promise<Streak> {
  return computeStreak(await allDaily(), today);
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  const row = await (await db()).get('meta', key);
  return row?.value as T | undefined;
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  await (await db()).put('meta', { key, value });
}

export async function countAttempts(): Promise<number> {
  return (await db()).count('attempts');
}
