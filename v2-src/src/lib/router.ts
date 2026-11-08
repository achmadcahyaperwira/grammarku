import { useEffect, useState } from 'preact/hooks';

export interface Route {
  name: 'home' | 'units' | 'lesson' | 'practice' | 'bank' | 'review' | 'progress' | 'settings';
  unitNo?: number;
}

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [a, b] = parts;
  const n = b ? Number(b) : NaN;
  switch (a) {
    case 'unit':
      return Number.isInteger(n) ? { name: 'lesson', unitNo: n } : { name: 'units' };
    case 'practice':
      return Number.isInteger(n) ? { name: 'practice', unitNo: n } : { name: 'units' };
    case 'review':
      return b === 'start' ? { name: 'review' } : { name: 'bank' };
    case 'progress':
      return { name: 'progress' };
    case 'settings':
      return { name: 'settings' };
    default:
      return { name: 'home' };
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(location.hash));
  useEffect(() => {
    const on = () => {
      setRoute(parseHash(location.hash));
      window.scrollTo(0, 0);
    };
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function go(path: string): void {
  location.hash = path;
}

export function back(fallback: string): void {
  if (history.length > 1) history.back();
  else go(fallback);
}
