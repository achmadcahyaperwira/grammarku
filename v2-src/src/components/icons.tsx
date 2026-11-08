import type { JSX } from 'preact';

type P = JSX.SVGAttributes<SVGSVGElement>;
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': true } as const;

export const IconHome = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M10 21v-6h4v6" />
  </svg>
);
export const IconBook = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 4h11a3 3 0 0 1 3 3v14H7a3 3 0 0 1-3-3z" />
    <path d="M8 4v17" />
    <path d="M11 9h4M11 13h4" />
  </svg>
);
export const IconRepeat = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5" />
    <path d="M20 3.5v5h-5" />
    <path d="M20 12a8 8 0 0 1-13.7 5.7L4 15.5" />
    <path d="M4 20.5v-5h5" />
  </svg>
);
export const IconChart = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 20h16" />
    <path d="M7 16v-4M12 16V7M17 16v-7" />
  </svg>
);
export const IconGear = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);
export const IconBack = (p: P) => (
  <svg {...base} {...p}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);
export const IconClose = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconSearch = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
export const IconCheck = (p: P) => (
  <svg {...base} stroke-width={2.6} {...p}>
    <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
  </svg>
);
export const IconCross = (p: P) => (
  <svg {...base} stroke-width={2.6} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

/** Tanda status unit: lingkaran kosong, setengah, atau penuh dengan centang. */
export function StatusMark({ status }: { status: 'new' | 'learning' | 'done' }) {
  if (status === 'done')
    return (
      <svg class="mark" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="10" fill="var(--ink)" />
        <path d="M6.5 11.5 9.7 14.6 15.8 7.8" fill="none" stroke="var(--paper)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    );
  if (status === 'learning')
    return (
      <svg class="mark" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="9.25" fill="none" stroke="var(--ink)" stroke-width="1.5" />
        <path d="M11 1.75a9.25 9.25 0 0 1 0 18.5z" fill="var(--ink)" />
      </svg>
    );
  return (
    <svg class="mark" viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="9.25" fill="none" stroke="var(--ink-3)" stroke-width="1.5" />
    </svg>
  );
}
