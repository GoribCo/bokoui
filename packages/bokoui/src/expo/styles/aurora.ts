import { type NativeCustomTheme } from "../tokens";

/** Aurora: a night sky of drifting green, cyan, violet and pink glows behind faint frosted cards. */
export const aurora: NativeCustomTheme = {
  label: "Aurora",
  base: "flat",
  tokens: { "radius-control": "1rem", "radius-button": "1rem", "radius-card": "1.5rem", "heading-weight": "700", "heading-tracking": "-0.02em" },
  light: {
    bg: "#eefaf7", fg: "#10253a", surface: "#f7fffd", muted: "#dff3ee", "muted-fg": "#3b5a63", border: "#c3e4dc", field: "#fafffd", "field-border": "#5a878d", ring: "#0f766e",
    primary: "#0f766e", "primary-fg": "#ffffff", secondary: "#5b3fd1", "secondary-fg": "#ffffff", accent: "#a21c7a", "accent-fg": "#ffffff",
  },
  dark: {
    bg: "#070b1a", fg: "#eaf6ff", surface: "#0f1730", muted: "#172140", "muted-fg": "#a9bcdf", border: "#25345f", field: "#0a1024", "field-border": "#5b73ad", ring: "#5eead4",
    primary: "#5eead4", "primary-fg": "#031311", secondary: "#a78bfa", "secondary-fg": "#0b0620", accent: "#f0abfc", "accent-fg": "#1e0425",
  },
  lightEffects: {
    card: { background: "rgba(255,255,255,0.6)", blur: 20, saturate: 140, borderColor: "rgba(255,255,255,0.85)", borderWidth: 1, shadow: "0 8px 28px rgba(16,90,100,0.12)" },
    control: { background: "rgba(255,255,255,0.65)", blur: 14, borderColor: "rgba(255,255,255,0.9)", borderWidth: 1 },
    pressed: { background: "rgba(255,255,255,0.85)" },
    field: { background: "rgba(255,255,255,0.7)", blur: 12, borderColor: "rgba(15,118,110,0.35)" },
    solid: { gradient: "linear-gradient(135deg, #14b8a6, #0f766e)", shadow: "0 8px 22px rgba(15,118,110,0.35)" },
    page: { gradient: "radial-gradient(ellipse at 15% 0%, rgba(110,231,183,0.7), transparent 50%), radial-gradient(ellipse at 85% 10%, rgba(165,180,252,0.65), transparent 50%), radial-gradient(ellipse at 50% 60%, rgba(125,211,252,0.45), transparent 55%), radial-gradient(ellipse at 10% 100%, rgba(244,184,252,0.5), transparent 50%), linear-gradient(#eefaf7, #eefaf7)" },
  },
  darkEffects: {
    card: { background: "rgba(255,255,255,0.06)", blur: 20, saturate: 140, borderColor: "rgba(255,255,255,0.14)", borderWidth: 1, shadow: "0 8px 32px rgba(0,0,0,0.35)" },
    control: { background: "rgba(255,255,255,0.08)", blur: 14, borderColor: "rgba(255,255,255,0.16)", borderWidth: 1 },
    pressed: { background: "rgba(255,255,255,0.18)" },
    field: { background: "rgba(255,255,255,0.05)", blur: 12, borderColor: "rgba(255,255,255,0.2)" },
    solid: { gradient: "linear-gradient(135deg, #5eead4, #38bdf8)", shadow: "0 0 24px rgba(94,234,212,0.35)" },
    page: { gradient: "radial-gradient(ellipse at 20% 0%, rgba(52,211,153,0.45), transparent 50%), radial-gradient(ellipse at 80% 10%, rgba(167,139,250,0.45), transparent 50%), radial-gradient(ellipse at 50% 60%, rgba(34,211,238,0.25), transparent 55%), radial-gradient(ellipse at 10% 100%, rgba(240,171,252,0.3), transparent 50%), linear-gradient(#070b1a, #070b1a)" },
  },
};
