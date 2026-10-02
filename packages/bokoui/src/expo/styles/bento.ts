import { type NativeCustomTheme } from "../tokens";

/** Bento: a soft gray page with borderless white tiles of big radius and a hint of shadow, bold tight headings. */
export const bento: NativeCustomTheme = {
  label: "Bento",
  base: "flat",
  tokens: { "radius-control": "0.875rem", "radius-button": "0.875rem", "radius-card": "1.75rem", "heading-weight": "700", "heading-tracking": "-0.03em" },
  light: {
    bg: "#eef0f4", fg: "#14161a", surface: "#ffffff", muted: "#e4e7ec", "muted-fg": "#525a66", border: "#dfe3ea", field: "#ffffff", "field-border": "#7a8396", ring: "#3b5bfd",
    primary: "#3b5bfd", "primary-fg": "#ffffff", secondary: "#475569", accent: "#e8552a", "accent-fg": "#14110f",
  },
  dark: {
    bg: "#0e1014", fg: "#eceff4", surface: "#171a21", muted: "#20242d", "muted-fg": "#a5adbb", border: "#262b35", field: "#0e1014", "field-border": "#6b7384", ring: "#7d93ff",
    primary: "#7d93ff", "primary-fg": "#0e1014", accent: "#ff8a63", "accent-fg": "#0e1014",
  },
  lightEffects: { card: { borderWidth: 0, shadow: "0 1px 2px rgba(16,24,40,0.05), 0 8px 24px rgba(16,24,40,0.05)" } },
  darkEffects: { card: { borderWidth: 0, shadow: "0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.25)" } },
};
