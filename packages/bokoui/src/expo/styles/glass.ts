import { type NativeCustomTheme } from "../tokens";

/** Glassmorphism: frosted translucent panels with a bright edge over a colorful blurred page. */
export const glass: NativeCustomTheme = {
  label: "Glassmorphism",
  base: "flat",
  tokens: { "radius-control": "1rem", "radius-button": "1rem", "radius-card": "1.5rem", "heading-weight": "700", "heading-tracking": "-0.02em" },
  light: {
    bg: "#dfe6fb", fg: "#1b2144", surface: "#eef1fd", muted: "#e3e8fb", "muted-fg": "#44507e", border: "#c9d1f0", field: "#f4f6ff", "field-border": "#6a76ad", ring: "#4b5bf0",
    primary: "#4b5bf0", "primary-fg": "#ffffff", secondary: "#44507e", accent: "#a21c7a", "accent-fg": "#ffffff", warning: "#a14a07", "warning-fg": "#ffffff",
  },
  dark: {
    bg: "#0f1230", fg: "#eef0ff", surface: "#1a1e4a", muted: "#1b1f4a", "muted-fg": "#b9c0f2", border: "#3a418a", field: "#141842", "field-border": "#6b76c9", ring: "#8b9bff",
    primary: "#8b9bff", "primary-fg": "#0b0e2a", secondary: "#b9c0f2", accent: "#ff9ad5", "accent-fg": "#2a0a1c",
  },
  lightEffects: {
    card: { background: "rgba(255,255,255,0.38)", blur: 24, saturate: 140, borderColor: "rgba(255,255,255,0.7)", borderWidth: 1, shadow: "0 8px 32px rgba(60,70,160,0.18)" },
    control: { background: "rgba(255,255,255,0.45)", blur: 16, borderColor: "rgba(255,255,255,0.8)", borderWidth: 1, shadow: "0 4px 16px rgba(60,70,160,0.12)" },
    pressed: { background: "rgba(255,255,255,0.7)" },
    field: { background: "rgba(255,255,255,0.5)", blur: 12, borderColor: "rgba(255,255,255,0.85)" },
    solid: { gradient: "linear-gradient(135deg, rgba(120,110,255,0.96), rgba(70,90,240,0.96))", borderColor: "rgba(255,255,255,0.5)", shadow: "0 8px 24px rgba(75,91,240,0.4)" },
    page: { gradient: "radial-gradient(circle at 15% 10%, #c4b5fd 0%, transparent 45%), radial-gradient(circle at 85% 20%, #7dd3fc 0%, transparent 45%), radial-gradient(circle at 50% 100%, #f9a8d4 0%, transparent 50%), linear-gradient(180deg, #e8ecff, #dfe6fb)" },
  },
  darkEffects: {
    card: { background: "rgba(255,255,255,0.08)", blur: 24, saturate: 140, borderColor: "rgba(255,255,255,0.18)", borderWidth: 1, shadow: "0 8px 32px rgba(0,0,0,0.35)" },
    control: { background: "rgba(255,255,255,0.1)", blur: 16, borderColor: "rgba(255,255,255,0.22)", borderWidth: 1, shadow: "0 4px 16px rgba(0,0,0,0.25)" },
    pressed: { background: "rgba(255,255,255,0.2)" },
    field: { background: "rgba(255,255,255,0.07)", blur: 12, borderColor: "rgba(255,255,255,0.22)" },
    solid: { gradient: "linear-gradient(135deg, rgba(150,160,255,0.98), rgba(110,125,255,0.98))", borderColor: "rgba(255,255,255,0.4)", shadow: "0 8px 24px rgba(110,125,255,0.4)" },
    page: { gradient: "radial-gradient(circle at 15% 10%, rgba(139,92,246,0.55) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(56,189,248,0.4) 0%, transparent 45%), radial-gradient(circle at 50% 100%, rgba(236,72,153,0.4) 0%, transparent 50%), linear-gradient(180deg, #121540, #0b0e2a)" },
  },
};
