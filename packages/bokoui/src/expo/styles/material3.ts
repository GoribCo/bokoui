import type { NativeCustomTheme } from "@/expo";

/** Material 3: tonal surfaces, a purple key color, pill buttons, filled cards without borders. */
export const material3: NativeCustomTheme = {
  label: "Material 3",
  base: "flat",
  tokens: { "radius-control": "0.75rem", "radius-button": "999px", "radius-card": "0.75rem", "heading-weight": "400", "heading-tracking": "0em", "btn-weight": "500", "ink-tone": "85%" },
  light: {
    bg: "#fef7ff", fg: "#1d1b20", surface: "#f3edf7", muted: "#e7e0ec", "muted-fg": "#49454f", border: "#cac4d0", field: "#fef7ff", "field-border": "#79747e", ring: "#6750a4",
    primary: "#6750a4", "primary-fg": "#ffffff", secondary: "#625b71", "secondary-fg": "#ffffff", accent: "#7d5260", "accent-fg": "#ffffff",
  },
  dark: {
    bg: "#141218", fg: "#e6e0e9", surface: "#211f26", muted: "#2b2930", "muted-fg": "#cac4d0", border: "#49454f", field: "#141218", "field-border": "#938f99", ring: "#d0bcff",
    primary: "#d0bcff", "primary-fg": "#381e72", secondary: "#ccc2dc", "secondary-fg": "#332d41", accent: "#efb8c8", "accent-fg": "#492532",
  },
  effects: { card: { borderWidth: 0 } },
};
