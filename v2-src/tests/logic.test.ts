import 'fake-indexeddb/auto';
import { describe, expect, it, beforeEach } from 'vitest';
import { normalize, matches, gradeGap, gradeOrder, gradeFix, gradeMC, shuffleTokens, splitGap } from '../src/lib/grading';
import { addDays, localDate } from '../src/lib/dates';
import { onWrong, onReviewCorrect, pickDue } from '../src/lib/leitner';
import { computeStreak } from '../src/lib/streak';
import { recordAnswer, finishSession, allProgress, allReviewItems, getStreak, resetConnection, DB_NAME } from '../src/lib/db';
import { buildBackup, parseBackup, restoreBackup, BackupError } from '../src/lib/backup';
import type { FixQuestion, GapQuestion, MCQuestion, OrderQuestion, ReviewItem } from '../src/lib/types';

describe('normalisasi', () => {
  it('mengabaikan huruf besar, spasi, apostrof lengkung, dan tanda baca ujung', () => {
    expect(normalize('  Has   BEEN ')).toBe('has been');
    expect(normalize('I’ve gone.')).toBe('i have gone');
    expect(matches("’s been", ["'s been"])).toBe(true);
  });
  it('menyamakan bentuk singkat yang tidak ambigu', () => {
    expect(matches("doesn't work", ['does not work'])).toBe(true);
    expect(matches("won't", ['will not'])).toBe(true);
    expect(matches("can't", ['cannot'])).toBe(true);
    expect(matches("can not", ["can't"])).toBe(true);
    expect(matches("they're", ['they are'])).toBe(true);
    expect(matches("I'm", ['I am'])).toBe(true);
  });
  it("tidak menebak 's dan 'd", () => {
    expect(matches("he's", ['he is'])).toBe(false);
    expect(matches('', ['for'])).toBe(false);
  });
});

describe('penilaian 4 jenis soal', () => {
  const mc: MCQuestion = { id: 'x1', type: 'mc', instruction: '', explanation: '', sentence: '', options: [{ id: 'a', text: 'for', why: '' }, { id: 'b', text: 'since', why: '' }], answer: 'b' };
  const gap: GapQuestion = { id: 'x2', type: 'gap', instruction: '', explanation: '', sentence: 'A {{1}} b {{2}}.', blanks: [{ accept: ['for', 'in'] }, { accept: ['since'] }] };
  const ord: OrderQuestion = { id: 'x3', type: 'order', instruction: '', explanation: '', tokens: ['How', 'long', 'have', 'you', 'waited', '?'], accept: [['How', 'long', 'have', 'you', 'waited', '?']] };
  const fix: FixQuestion = { id: 'x4', type: 'fix', instruction: '', explanation: '', segments: ['How long', 'do you know', 'her', '?'], errorIndex: 1, accept: ['have you known'], corrected: 'How long have you known her?' };
  it('mc', () => {
    expect(gradeMC(mc, 'b')).toBe(true);
    expect(gradeMC(mc, 'a')).toBe(false);
  });
  it('gap: semua rumpang harus benar, varian diterima', () => {
    expect(gradeGap(gap, ['in', 'since']).correct).toBe(true);
    expect(gradeGap(gap, ['for', 'for'])).toEqual({ correct: false, perBlank: [true, false] });
    expect(splitGap(gap.sentence)).toEqual(['A ', 0, ' b ', 1, '.']);
  });
  it('order', () => {
    expect(gradeOrder(ord, ['How', 'long', 'have', 'you', 'waited', '?'])).toBe(true);
    expect(gradeOrder(ord, ['How', 'long', 'you', 'have', 'waited', '?'])).toBe(false);
    for (let i = 0; i < 50; i++) {
      const seq = shuffleTokens(ord).map((j) => ord.tokens[j]);
      expect(gradeOrder(ord, seq)).toBe(false);
    }
  });
  it('fix: segmen dan perbaikan harus sama-sama tepat', () => {
    expect(gradeFix(fix, 1, "Have you known").correct).toBe(true);
    expect(gradeFix(fix, 0, 'have you known')).toEqual({ correct: false, segmentOk: false, textOk: true });
    expect(gradeFix(fix, 1, 'did you know').correct).toBe(false);
  });
});

describe('tanggal dan Leitner', () => {
  it('addDays melewati akhir bulan dan tahun', () => {
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(localDate(new Date(2026, 10, 8, 23, 59))).toBe('2026-11-08');
  });
  it('jatuh tempo +1, +3, +7, +14, +30 lalu keluar', () => {
    let day = '2026-11-08';
    let item: ReviewItem | null = onWrong(undefined, 'q', 1, day);
    const gaps: number[] = [];
    let prev = day;
    gaps.push(1);
    expect(item.dueDate).toBe(addDays(day, 1));
    while (item) {
      day = item.dueDate;
      prev = day;
      item = onReviewCorrect(item, day);
      if (item) gaps.push(Number(new Date(item.dueDate).getTime() - new Date(prev).getTime()) / 864e5);
    }
    expect(gaps).toEqual([1, 3, 7, 14, 30]);
  });
  it('salah di kotak mana pun kembali ke kotak 1', () => {
    const it4: ReviewItem = { questionId: 'q', unitNo: 1, box: 4, dueDate: '2026-11-08', lapses: 1, addedAt: '2026-10-01', lastReviewedAt: null };
    const back = onWrong(it4, 'q', 1, '2026-11-08');
    expect(back.box).toBe(1);
    expect(back.lapses).toBe(2);
    expect(back.addedAt).toBe('2026-10-01');
  });
  it('pickDue mengurutkan dari yang paling lama dan membatasi 20', () => {
    const items: ReviewItem[] = Array.from({ length: 30 }, (_, i) => ({ questionId: 'q' + i, unitNo: 1, box: 1, dueDate: addDays('2026-11-01', i % 10), lapses: 1, addedAt: '2026-10-01', lastReviewedAt: null }));
    const due = pickDue(items, '2026-11-08');
    expect(due.length).toBe(20);
    expect(due[0].dueDate).toBe('2026-11-01');
    expect(due.every((d) => d.dueDate <= '2026-11-08')).toBe(true);
  });
});

describe('streak', () => {
  // 2026-11-02 = Senin
  const days = ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-06'].map((d) => ({ localDate: d, answers: 12, correct: 8 }));
  it('Senin–Rabu aktif, Kamis kosong, Jumat aktif: saat ini 1, terpanjang 3', () => {
    const s = computeStreak(days, '2026-11-06');
    expect(s.current).toBe(1);
    expect(s.longest).toBe(3);
  });
  it('hari ini belum aktif: streak kemarin tetap terhitung', () => {
    expect(computeStreak(days, '2026-11-07').current).toBe(1);
    expect(computeStreak(days, '2026-11-08').current).toBe(0);
  });
  it('kurang dari 10 jawaban tidak dihitung aktif', () => {
    expect(computeStreak([{ localDate: '2026-11-08', answers: 9, correct: 9 }], '2026-11-08').current).toBe(0);
  });
});

describe('penyimpanan dan cadangan (IndexedDB)', () => {
  beforeEach(async () => {
    await resetConnection();
    await new Promise<void>((res) => {
      const r = indexedDB.deleteDatabase(DB_NAME);
      r.onsuccess = r.onerror = r.onblocked = () => res();
    });
  });

  it('jawaban salah masuk bank sekali saja, jatuh tempo besok', async () => {
    const now = new Date(2026, 10, 8, 10);
    for (let i = 0; i < 3; i++) await recordAnswer({ questionId: 'u012-q02', unitNo: 12, mode: 'practice', correct: false, response: 'x', sessionId: 's', now });
    const items = await allReviewItems();
    expect(items.length).toBe(1);
    expect(items[0].dueDate).toBe('2026-11-09');
    const p = await allProgress();
    expect(p.get(12)?.status).toBe('learning');
  });

  it('status Selesai pada skor >= 70% dan tidak turun', async () => {
    let p = await finishSession(3, 13, 20, true);
    expect(p.status).toBe('learning');
    p = await finishSession(3, 15, 20, true);
    expect(p.status).toBe('done');
    expect(p.bestScore).toBe(0.75);
    p = await finishSession(3, 5, 20, true);
    expect(p.status).toBe('done');
    expect(p.lastScore).toBe(0.25);
    expect(p.bestScore).toBe(0.75);
    expect(p.sessions).toBe(3);
  });

  it('ekspor lalu impor menghasilkan keadaan identik', async () => {
    const now = new Date();
    for (let i = 0; i < 11; i++) await recordAnswer({ questionId: 'u001-q' + i, unitNo: 1, mode: 'practice', correct: i % 3 !== 0, response: i, sessionId: 's', now });
    await finishSession(1, 15, 20, true);
    const before = await buildBackup('test');
    const streakBefore = await getStreak();
    expect(streakBefore.current).toBe(1);

    await resetConnection();
    await new Promise<void>((res) => {
      const r = indexedDB.deleteDatabase(DB_NAME);
      r.onsuccess = r.onerror = r.onblocked = () => res();
    });
    expect((await allReviewItems()).length).toBe(0);

    await restoreBackup(parseBackup(JSON.stringify(before)));
    const after = await buildBackup('test');
    expect(after.data).toEqual(before.data);
    expect((await getStreak()).current).toBe(1);
  });

  it('file rusak ditolak tanpa mengubah data', async () => {
    await recordAnswer({ questionId: 'a', unitNo: 1, mode: 'practice', correct: false, response: 1, sessionId: 's' });
    expect(() => parseBackup('{bukan json')).toThrow(BackupError);
    expect(() => parseBackup(JSON.stringify({ app: 'lain' }))).toThrow(BackupError);
    expect(() => parseBackup(JSON.stringify({ app: 'cays-english-v2', schemaVersion: 9, data: {} }))).toThrow(/Versi/);
    expect((await allReviewItems()).length).toBe(1);
  });
});
