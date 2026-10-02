import { type NativeCustomTheme } from "../tokens";

/** Minimalism: white space, hairlines, black as the only accent, no shadows. */
export const minimalism: NativeCustomTheme = {
  label: "Minimalism",
  base: "flat",
  tokens: { "radius-control": "0.375rem", "radius-button": "0.375rem", "radius-card": "0.5rem", "heading-weight": "500", "heading-tracking": "-0.01em" },
  light: {
    bg: "#ffffff", fg: "#111111", surface: "#ffffff", muted: "#f5f5f5", "muted-fg": "#5c5c5c", border: "#e6e6e6", field: "#ffffff", "field-border": "#8a8a8a", ring: "#111111",
    primary: "#111111", "primary-fg": "#ffffff", secondary: "#555555", "secondary-fg": "#ffffff", accent: "#6b6b6b", "accent-fg": "#ffffff",
  },
  dark: {
    bg: "#0b0b0b", fg: "#f2f2f2", surface: "#0b0b0b", muted: "#1a1a1a", "muted-fg": "#a3a3a3", border: "#262626", field: "#0b0b0b", "field-border": "#5e5e5e", ring: "#f2f2f2",
    primary: "#f2f2f2", "primary-fg": "#0b0b0b", secondary: "#a3a3a3", "secondary-fg": "#0b0b0b", accent: "#d4d4d4", "accent-fg": "#0b0b0b",
  },
};
