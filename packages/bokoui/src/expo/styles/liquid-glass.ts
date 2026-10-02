import type { NativeCustomTheme } from "@/expo";

/** Liquid glass (iOS 26 look): more transparent and rounder than glass, saturated backdrop, a bright specular rim at the top edge. */
export const liquidGlass: NativeCustomTheme = {
  label: "Liquid Glass",
  base: "flat",
  tokens: { "radius-control": "1.5rem", "radius-button": "999px", "radius-card": "2rem", "heading-weight": "700", "heading-tracking": "-0.03em", "btn-weight": "600" },
  light: {
    bg: "#e6ebff", fg: "#0b1020", surface: "#f3f6ff", muted: "#e4e9fb", "muted-fg": "#434b66", border: "#cfd6ee", field: "#f6f8ff", "field-border": "#7b86b2", ring: "#0b63e5",
    primary: "#0b63e5", "primary-fg": "#ffffff", secondary: "#434b66", accent: "#a1286f", "accent-fg": "#ffffff",
  },
  dark: {
    bg: "#0a0d1c", fg: "#f2f4ff", surface: "#151a33", muted: "#1a2040", "muted-fg": "#b4bcdf", border: "#2c3466", field: "#10142a", "field-border": "#6870a6", ring: "#6fb1ff",
    primary: "#6fb1ff", "primary-fg": "#04122b", secondary: "#b4bcdf", accent: "#ff9ad5", "accent-fg": "#2a0a1c",
  },
  lightEffects: {
    card: { background: "rgba(255,255,255,0.24)", blur: 30, saturate: 180, borderColor: "rgba(255,255,255,0.55)", borderWidth: 1, shadow: "inset 0 1px 1px rgba(255,255,255,0.95), inset 0 -1px 1px rgba(255,255,255,0.3), 0 12px 32px rgba(20,30,90,0.12)" },
    control: { background: "rgba(255,255,255,0.3)", blur: 24, saturate: 180, borderColor: "rgba(255,255,255,0.65)", borderWidth: 1, shadow: "inset 0 1px 1px rgba(255,255,255,0.95), 0 6px 18px rgba(20,30,90,0.1)" },
    pressed: { background: "rgba(255,255,255,0.55)" },
    field: { background: "rgba(255,255,255,0.4)", blur: 20, saturate: 160, borderColor: "rgba(255,255,255,0.8)", shadow: "inset 0 1px 3px rgba(20,30,90,0.12)" },
    solid: { gradient: "linear-gradient(180deg, rgba(60,140,255,0.98), rgba(11,99,229,0.98))", borderColor: "rgba(255,255,255,0.55)", shadow: "inset 0 1px 1px rgba(255,255,255,0.7), 0 8px 22px rgba(11,99,229,0.4)" },
    page: { gradient: "radial-gradient(circle at 20% 15%, #ffd6a5 0%, transparent 40%), radial-gradient(circle at 80% 30%, #a0c4ff 0%, transparent 45%), radial-gradient(circle at 40% 90%, #bdb2ff 0%, transparent 50%), linear-gradient(180deg, #f3f6ff, #e6ebff)" },
  },
  darkEffects: {
    card: { background: "rgba(40,46,90,0.32)", blur: 30, saturate: 180, borderColor: "rgba(255,255,255,0.16)", borderWidth: 1, shadow: "inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -1px 1px rgba(255,255,255,0.08), 0 12px 32px rgba(0,0,0,0.4)" },
    control: { background: "rgba(60,68,120,0.35)", blur: 24, saturate: 180, borderColor: "rgba(255,255,255,0.2)", borderWidth: 1, shadow: "inset 0 1px 1px rgba(255,255,255,0.35), 0 6px 18px rgba(0,0,0,0.3)" },
    pressed: { background: "rgba(90,100,170,0.5)" },
    field: { background: "rgba(20,24,52,0.5)", blur: 20, saturate: 160, borderColor: "rgba(255,255,255,0.2)", shadow: "inset 0 1px 3px rgba(0,0,0,0.4)" },
    solid: { gradient: "linear-gradient(180deg, rgba(150,200,255,0.98), rgba(90,160,255,0.98))", borderColor: "rgba(255,255,255,0.5)", shadow: "inset 0 1px 1px rgba(255,255,255,0.7), 0 8px 22px rgba(90,160,255,0.35)" },
    page: { gradient: "radial-gradient(circle at 20% 15%, rgba(255,160,100,0.35) 0%, transparent 40%), radial-gradient(circle at 80% 30%, rgba(80,130,255,0.45) 0%, transparent 45%), radial-gradient(circle at 40% 90%, rgba(150,110,255,0.45) 0%, transparent 50%), linear-gradient(180deg, #0f1330, #090b1c)" },
  },
};
