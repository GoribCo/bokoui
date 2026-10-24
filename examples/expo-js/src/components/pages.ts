/** Screens of this demo, in navigation order. The platform switcher uses the same list. */
export const pages = [
  { href: '/', label: 'Basics' },
  { href: '/playground', label: 'Overview' },
  { href: '/forms', label: 'Forms' },
  { href: '/display', label: 'Display' },
  { href: '/table', label: 'Table' },
  { href: '/feedback', label: 'Feedback' },
  { href: '/overlays', label: 'Overlays' },
  { href: '/tabs', label: 'Tabs' },
  { href: '/accordion', label: 'Accordion' },
  { href: '/patterns', label: 'Patterns' },
  { href: '/navigation', label: 'Navigation' },
] as const;

export type PagePath = (typeof pages)[number]['href'];
