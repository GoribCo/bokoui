/** Screens of this demo, in navigation order. The platform switcher uses the same list. */
export const pages = [
  { href: '/', label: 'Basics' },
  { href: '/forms', label: 'Forms' },
  { href: '/display', label: 'Display' },
  { href: '/feedback', label: 'Feedback' },
  { href: '/overlays', label: 'Overlays' },
  { href: '/navigation', label: 'Navigation' },
] as const;

export type PagePath = (typeof pages)[number]['href'];
