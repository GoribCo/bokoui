import type { NativeCustomTheme } from "@/expo";

/** Claymorphism: puffy, inflated shapes (a soft drop shadow, a bright inner top edge, a shaded inner bottom) on a lavender page. */
export const clay: NativeCustomTheme = {
  label: "Claymorphism",
  base: "flat",
  tokens: { "radius-control": "1.25rem", "radius-button": "1.5rem", "radius-card": "1.75rem", "border-width": "1px", "heading-weight": "800", "heading-tracking": "-0.02em", "btn-weight": "700" },
  light: {
    bg: "#ebe6fa", fg: "#231a4a", surface: "#f6f3ff", muted: "#ddd6f5", "muted-fg": "#50477a", border: "#ddd6f5", field: "#f6f3ff", "field-border": "#7f76b8", ring: "#7c5cf0",
    primary: "#6a48e8", "primary-fg": "#ffffff", secondary: "#50477a", accent: "#b8326a", "accent-fg": "#ffffff", warning: "#b45309", "warning-fg": "#ffffff",
  },
  dark: {
    bg: "#1e1a3a", fg: "#f1edff", surface: "#2c2754", muted: "#373068", "muted-fg": "#c5bdf0", border: "#2c2754", field: "#25204a", "field-border": "#9088cf", ring: "#a794ff",
    primary: "#a794ff", "primary-fg": "#1b1440", secondary: "#c5bdf0", accent: "#ff8fb8", "accent-fg": "#33061a",
  },
  lightEffects: {
    card: { borderWidth: 0, shadow: "0 12px 28px rgba(111,89,200,0.25), inset 0 5px 10px rgba(255,255,255,0.95), inset 0 -7px 12px rgba(150,130,220,0.22)" },
    control: { borderWidth: 0, shadow: "0 8px 18px rgba(111,89,200,0.22), inset 0 4px 8px rgba(255,255,255,0.95), inset 0 -5px 9px rgba(150,130,220,0.2)" },
    pressed: { shadow: "inset 0 6px 12px rgba(111,89,200,0.28), inset 0 -2px 6px rgba(255,255,255,0.7)" },
    field: { borderWidth: 1, shadow: "inset 0 4px 10px rgba(111,89,200,0.2), inset 0 -2px 4px rgba(255,255,255,0.9)" },
    solid: { gradient: "linear-gradient(180deg, #8a6df5, #6a48e8)", shadow: "0 12px 24px rgba(106,72,232,0.4), inset 0 4px 8px rgba(255,255,255,0.45), inset 0 -6px 10px rgba(60,30,160,0.35)" },
    page: { gradient: "linear-gradient(180deg, #f1edff, #e4defa)" },
  },
  darkEffects: {
    card: { borderWidth: 0, shadow: "0 12px 28px rgba(0,0,0,0.45), inset 0 4px 8px rgba(255,255,255,0.12), inset 0 -6px 12px rgba(0,0,0,0.35)" },
    control: { borderWidth: 0, shadow: "0 8px 18px rgba(0,0,0,0.4), inset 0 3px 7px rgba(255,255,255,0.12), inset 0 -5px 9px rgba(0,0,0,0.3)" },
    pressed: { shadow: "inset 0 6px 12px rgba(0,0,0,0.45), inset 0 -2px 6px rgba(255,255,255,0.06)" },
    field: { borderWidth: 1, shadow: "inset 0 4px 10px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.06)" },
    solid: { gradient: "linear-gradient(180deg, #b7a7ff, #8f78f5)", shadow: "0 12px 24px rgba(0,0,0,0.45), inset 0 4px 8px rgba(255,255,255,0.4), inset 0 -6px 10px rgba(40,20,120,0.35)" },
    page: { gradient: "linear-gradient(180deg, #241f47, #1a1634)" },
  },
};
