import { createContext } from 'preact';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { loadCatalog } from './content';
import { allProgress, allReviewItems, getMeta, getStreak } from './db';
import { localDate } from './dates';
import type { Streak } from './streak';
import type { Catalog, ReviewItem, UnitProgress } from './types';

export interface AppData {
  catalog: Catalog;
  progress: Map<number, UnitProgress>;
  review: ReviewItem[];
  streak: Streak;
  today: string;
  lastUnit: number | null;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AppData | null>(null);

export function useApp(): AppData {
  const v = useContext(Ctx);
  if (!v) throw new Error('AppData belum siap');
  return v;
}

export function AppProvider({ children }: { children: ComponentChildren }) {
  const [data, setData] = useState<Omit<AppData, 'refresh'> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const today = localDate();
      const [catalog, progress, review, streak, lastUnit] = await Promise.all([
        loadCatalog(),
        allProgress(),
        allReviewItems(),
        getStreak(today),
        getMeta<number>('lastUnit')
      ]);
      setData({ catalog, progress, review, streak, today, lastUnit: lastUnit ?? null });
    } catch (e) {
      setError(String((e as Error)?.message ?? e));
    }
  }, []);

  useEffect(() => {
    refresh();
    const onVis = () => document.visibilityState === 'visible' && refresh();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [refresh]);

  if (error)
    return (
      <div class="loading">
        <p>Aplikasi tidak bisa dimuat: {error}</p>
        <p>Buka sekali saat online supaya materi tersimpan di HP, lalu coba lagi.</p>
        <button class="btn" onClick={() => location.reload()}>
          Muat ulang
        </button>
      </div>
    );
  if (!data) return <div class="loading">Memuat…</div>;
  return <Ctx.Provider value={{ ...data, refresh }}>{children}</Ctx.Provider>;
}

export function pct(x: number | null | undefined): string {
  return x == null ? '' : `${Math.round(x * 100)}%`;
}

/** *teks* menjadi kata bahasa Inggris bergaya miring. */
export function rich(text: string) {
  const parts = text.split(/\*([^*]+)\*/g);
  return parts.map((p, i) => (i % 2 ? <em lang="en" key={i}>{p}</em> : p));
}

export function joinTokens(tokens: string[]): string {
  return tokens.join(' ').replace(/\s+([?.!,;:])/g, '$1');
}

export function lsGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
export function lsSet(key: string, v: string): void {
  try {
    sessionStorage.setItem(key, v);
  } catch {
    /* penyimpanan sesi tidak tersedia */
  }
}
