import { db, STORES } from './db';
import { localDate } from './dates';

export const APP_ID = 'cays-english-v2';
export const BACKUP_SCHEMA = 1;

export interface BackupFile {
  app: string;
  schemaVersion: number;
  contentVersion: string;
  exportedAt: string;
  data: Record<(typeof STORES)[number], unknown[]>;
}

export async function buildBackup(contentVersion: string): Promise<BackupFile> {
  const d = await db();
  const tx = d.transaction([...STORES], 'readonly');
  const data = {} as BackupFile['data'];
  for (const s of STORES) data[s] = await tx.objectStore(s).getAll();
  await tx.done;
  return { app: APP_ID, schemaVersion: BACKUP_SCHEMA, contentVersion, exportedAt: new Date().toISOString(), data };
}

export function backupFileName(now = new Date()): string {
  return `grammar-backup-${localDate(now)}.json`;
}

export class BackupError extends Error {}

/** Periksa isi file cadangan tanpa menulis apa pun. */
export function parseBackup(text: string): BackupFile {
  let obj: any;
  try {
    obj = JSON.parse(text);
  } catch {
    throw new BackupError('File ini bukan JSON yang valid.');
  }
  if (!obj || obj.app !== APP_ID) throw new BackupError("File ini bukan cadangan Cay's English V2.");
  if (obj.schemaVersion !== BACKUP_SCHEMA) throw new BackupError(`Versi cadangan ${obj.schemaVersion} tidak dikenal.`);
  if (!obj.data || typeof obj.data !== 'object') throw new BackupError('Bagian data tidak ditemukan.');
  for (const s of STORES) {
    if (!Array.isArray(obj.data[s])) throw new BackupError(`Bagian "${s}" rusak atau hilang.`);
  }
  const keyOk: Record<string, (r: any) => boolean> = {
    unitProgress: (r) => typeof r.unitNo === 'number' && typeof r.status === 'string',
    attempts: (r) => typeof r.questionId === 'string' && typeof r.localDate === 'string',
    reviewItems: (r) => typeof r.questionId === 'string' && typeof r.box === 'number' && typeof r.dueDate === 'string',
    dailyActivity: (r) => typeof r.localDate === 'string' && typeof r.answers === 'number',
    meta: (r) => typeof r.key === 'string'
  };
  for (const s of STORES) {
    if (!obj.data[s].every((r: any) => r && keyOk[s](r))) throw new BackupError(`Ada baris yang rusak di bagian "${s}".`);
  }
  return obj as BackupFile;
}

/** Timpa semua data dengan isi cadangan, dalam satu transaksi (semua atau tidak sama sekali). */
export async function restoreBackup(file: BackupFile): Promise<void> {
  const d = await db();
  const tx = d.transaction([...STORES], 'readwrite');
  try {
    for (const s of STORES) {
      const store = tx.objectStore(s);
      await store.clear();
      for (const row of file.data[s]) await store.put(row as never);
    }
    await tx.done;
  } catch (e) {
    try {
      tx.abort();
    } catch {
      /* sudah dibatalkan */
    }
    throw new BackupError('Impor gagal, data lama tidak diubah. ' + String((e as Error)?.message ?? e));
  }
}

export function summarize(file: BackupFile): { units: number; done: number; attempts: number; review: number } {
  const ups = file.data.unitProgress as { status: string }[];
  return {
    units: ups.length,
    done: ups.filter((u) => u.status === 'done').length,
    attempts: file.data.attempts.length,
    review: file.data.reviewItems.length
  };
}
