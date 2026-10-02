import type { NativeCustomTheme } from "@/expo";

/** Synthwave: a purple night sky with a sunset horizon, neon pink and cyan outlines that glow, uppercase headings. */
export const synthwave: NativeCustomTheme = {
  label: "Synthwave",
  base: "flat",
  tokens: { "radius-control": "0.75rem", "radius-button": "0.75rem", "radius-card": "1rem", "heading-weight": "800", "heading-tracking": "0.04em", "heading-transform": "uppercase", "btn-weight": "800", "btn-transform": "uppercase", "btn-tracking": "0.06em" },
  light: {
    bg: "#fbeeff", fg: "#2a0f4a", surface: "#ffffff", muted: "#f1ddff", "muted-fg": "#5b2f87", border: "#d8b4f5", field: "#ffffff", "field-border": "#9a5fd0", ring: "#c000a0",
    primary: "#c000a0", "primary-fg": "#ffffff", secondary: "#00689a", "secondary-fg": "#ffffff", accent: "#8a4a00", "accent-fg": "#ffffff", neutral: "#2a0f4a", "neutral-fg": "#fbeeff",
  },
  dark: {
    bg: "#140a2a", fg: "#f7ecff", surface: "#20104a", muted: "#2b1763", "muted-fg": "#c9b4ee", border: "#5a2ca8", field: "#140a2a", "field-border": "#9b6df0", ring: "#00e5ff",
    primary: "#ff3dd8", "primary-fg": "#1a0222", secondary: "#00e5ff", "secondary-fg": "#02161a", accent: "#ffe14d", "accent-fg": "#1a1500", neutral: "#e8dcff", "neutral-fg": "#140a2a",
  },
  lightEffects: {
    card: { shadow: "0 8px 24px rgba(192,0,160,0.15), inset 0 0 0 1px rgba(192,0,160,0.25)" },
    control: { shadow: "inset 0 0 0 1px rgba(0,104,154,0.4)" },
    solid: { gradient: "linear-gradient(90deg, #c000a0, #e0561f)", shadow: "0 6px 18px rgba(192,0,160,0.4)" },
    page: { gradient: "radial-gradient(circle at 50% 110%, rgba(255,160,100,0.5), transparent 45%), linear-gradient(180deg, #fbeeff, #f3d9ff)" },
  },
  darkEffects: {
    card: { gradient: "linear-gradient(180deg, rgba(60,24,130,0.55), rgba(32,16,74,0.85))", shadow: "0 0 24px rgba(255,61,216,0.25), inset 0 0 0 1px rgba(255,61,216,0.35)" },
    control: { shadow: "0 0 14px rgba(0,229,255,0.3), inset 0 0 0 1px rgba(0,229,255,0.5)" },
    pressed: { shadow: "0 0 18px rgba(0,229,255,0.5), inset 0 0 0 1px rgba(0,229,255,0.8)" },
    field: { shadow: "inset 0 0 0 1px rgba(155,109,240,0.7)" },
    solid: { gradient: "linear-gradient(90deg, #ff3dd8, #ff7a45)", shadow: "0 0 22px rgba(255,61,216,0.65)" },
    page: { gradient: "radial-gradient(circle at 50% 110%, rgba(255,122,69,0.55), transparent 45%), linear-gradient(180deg, #140a2a 0%, #2a0f5c 60%, #4a1670 100%)" },
  },
};
