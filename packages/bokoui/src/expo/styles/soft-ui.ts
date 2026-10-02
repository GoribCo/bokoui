import type { NativeCustomTheme } from "@/expo";

/** Soft UI: a pale blue-gray page, cards lifted by wide diffused shadows with a white top edge, soft glow on the primary action. */
export const softUi: NativeCustomTheme = {
  label: "Soft UI",
  base: "flat",
  tokens: { "radius-control": "1rem", "radius-button": "1rem", "radius-card": "1.5rem", "heading-weight": "700", "heading-tracking": "-0.02em" },
  light: {
    bg: "#eef1f8", fg: "#1f2437", surface: "#f6f8fd", muted: "#e6eaf4", "muted-fg": "#555d78", border: "#dbe1ef", field: "#f6f8fd", "field-border": "#8d96b4", ring: "#6c5ce7",
    primary: "#6c5ce7", "primary-fg": "#ffffff", secondary: "#5b6486", accent: "#0b7f70", "accent-fg": "#ffffff",
  },
  dark: {
    bg: "#1a1d2b", fg: "#e9ecf8", surface: "#222638", muted: "#2b3045", "muted-fg": "#a6aec9", border: "#2f3550", field: "#1a1d2b", "field-border": "#6e769a", ring: "#9d8cff",
    primary: "#9d8cff", "primary-fg": "#12142a", accent: "#4fd1bd", "accent-fg": "#0b1f1c",
  },
  lightEffects: {
    card: { borderWidth: 0, shadow: "0 12px 32px rgba(108,120,170,0.18), 0 2px 6px rgba(108,120,170,0.10), inset 0 1px 0 rgba(255,255,255,0.9)" },
    control: { borderWidth: 0, shadow: "0 6px 16px rgba(108,120,170,0.16), inset 0 1px 0 rgba(255,255,255,0.9)" },
    pressed: { shadow: "inset 0 3px 8px rgba(108,120,170,0.25)" },
    field: { shadow: "inset 0 2px 6px rgba(108,120,170,0.16)" },
    solid: { shadow: "0 8px 20px rgba(108,92,231,0.35)", gradient: "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0) 60%)" },
  },
  darkEffects: {
    card: { borderWidth: 0, shadow: "0 12px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)" },
    control: { borderWidth: 0, shadow: "0 6px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)" },
    pressed: { shadow: "inset 0 3px 8px rgba(0,0,0,0.4)" },
    field: { shadow: "inset 0 2px 6px rgba(0,0,0,0.35)" },
    solid: { shadow: "0 8px 20px rgba(157,140,255,0.3)", gradient: "linear-gradient(180deg, rgba(255,255,255,0.25), rgba(255,255,255,0) 60%)" },
  },
};
