import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({ width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, ...p });

export const Diya = (p: P) => (
  <svg {...base({ ...p, fill: 'currentColor', stroke: 'none' })}>
    <path d="M12 2c1.7 2.4 3 4.2 3 6a3 3 0 1 1-6 0c0-1.8 1.3-3.6 3-6Z" />
    <path d="M3 14c2.5 2 5.7 3 9 3s6.5-1 9-3c-.6 3.4-4.2 6-9 6s-8.4-2.6-9-6Z" opacity=".85" />
  </svg>
);
export const Shield = (p: P) => (<svg {...base(p)}><path d="M12 2 4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-4Z" /><path d="m9 12 2 2 4-4" /></svg>);
export const Home = (p: P) => (<svg {...base(p)}><path d="M3 10 12 3l9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></svg>);
export const Rupee = (p: P) => (<svg {...base(p)}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>);
export const Heart = (p: P) => (<svg {...base(p)}><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z" /></svg>);
export const Calendar = (p: P) => (<svg {...base(p)}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
export const Sparkle = (p: P) => (<svg {...base(p)}><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" /></svg>);
export const Check = (p: P) => (<svg {...base(p)}><path d="M20 6 9 17l-5-5" /></svg>);
export const Search = (p: P) => (<svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>);
export const Pin = (p: P) => (<svg {...base(p)}><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10Z" /><circle cx="12" cy="11" r="2.2" /></svg>);
export const Chevron = (p: P) => (<svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>);
export const ArrowDown = (p: P) => (<svg {...base(p)}><path d="M12 5v14M5 12l7 7 7-7" /></svg>);
export const Menu = (p: P) => (<svg {...base(p)}><path d="M3 6h18M3 12h18M3 18h18" /></svg>);
export const Close = (p: P) => (<svg {...base(p)}><path d="M18 6 6 18M6 6l12 12" /></svg>);

export const Star = (p: P) => (<svg {...base({ ...p, fill: 'currentColor', stroke: 'none' })}><path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.9l-5.8 3.05 1.1-6.47L2.6 9.9l6.5-.95L12 2.5Z" /></svg>);
export const Person = (p: P) => (<svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>);
export const Basket = (p: P) => (<svg {...base(p)}><path d="M5 11h14l-1.2 8.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 11Z" /><path d="M9 11 12 4l3 7" /></svg>);
export const Bell = (p: P) => (<svg {...base(p)}><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 21a2 2 0 0 0 4 0" /></svg>);

export const Apple = (p: P) => (
  <svg {...base({ ...p, fill: 'currentColor', stroke: 'none' })}>
    <path d="M16.4 1.6c.1 1-.3 2-.9 2.7-.7.8-1.8 1.4-2.8 1.3-.1-1 .4-2 1-2.7.7-.8 1.9-1.3 2.7-1.3ZM20 17.2c-.5 1.2-.8 1.7-1.5 2.7-1 1.5-2.4 3.3-4.1 3.3-1.5 0-1.9-1-4-1-2 0-2.5 1-4 1-1.7 0-3-1.6-4-3.1-2.8-4.2-3.1-9.2-1.4-11.8C8.2 6.6 9.8 5.7 11.3 5.7c1.6 0 2.6 1 3.9 1 1.3 0 2-1 3.9-1 1.4 0 2.9.8 3.9 2.1-3.4 1.9-2.9 6.8.1 8.4Z" />
  </svg>
);
export const Play = (p: P) => (
  <svg {...base({ ...p, fill: 'currentColor', stroke: 'none' })}>
    <path d="M3.6 2.3 13.4 12 3.6 21.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1Zm11 10.6 2.6 2.6-9.9 5.6 7.3-8.2Zm0-1.8L7.3 3 17.2 8.5l-2.6 2.6ZM18.4 9.2l2.7 1.5c.6.4.6 1.2 0 1.6l-2.7 1.5L15.5 12l2.9-2.8Z" />
  </svg>
);
