import { type NativeCustomTheme } from "../tokens";

/** Skeuomorphism: brushed-metal gradients, bevels, strong highlights, sunken fields and glossy buttons, like physical hardware. */
export const skeuomorphism: NativeCustomTheme = {
  label: "Skeuomorphism",
  base: "flat",
  tokens: { "radius-control": "0.625rem", "radius-button": "0.75rem", "radius-card": "1rem", "heading-weight": "700", "heading-tracking": "-0.01em", "btn-weight": "700", "ink-tone": "45%" },
  light: {
    bg: "#cfd2d8", fg: "#1c1d20", surface: "#e6e8ec", muted: "#c3c7ce", "muted-fg": "#41454e", border: "#a9adb6", field: "#f2f3f5", "field-border": "#62666f", ring: "#6a48e8",
    primary: "#5a38d6", "primary-fg": "#ffffff", secondary: "#41454e", accent: "#a3320a", "accent-fg": "#ffffff", warning: "#a14a07", "warning-fg": "#ffffff",
  },
  dark: {
    bg: "#1f2023", fg: "#ececef", surface: "#34363b", muted: "#2a2c30", "muted-fg": "#b0b4bd", border: "#4a4d55", field: "#17181a", "field-border": "#7d818b", ring: "#a794ff",
    primary: "#a794ff", "primary-fg": "#140f33", secondary: "#b0b4bd", accent: "#ff9a6b", "accent-fg": "#2a0f00",
  },
  lightEffects: {
    card: { gradient: "linear-gradient(180deg, #f4f5f7, #d9dce2)", borderColor: "#b4b8c0", shadow: "0 3px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -2px 3px rgba(0,0,0,0.12)" },
    control: { gradient: "linear-gradient(180deg, #fbfbfc, #d3d6dc)", borderColor: "#a9adb6", shadow: "0 2px 4px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 3px rgba(0,0,0,0.15)" },
    pressed: { gradient: "linear-gradient(180deg, #c9ccd3, #e0e2e7)", shadow: "inset 0 3px 6px rgba(0,0,0,0.35)" },
    field: { gradient: "linear-gradient(180deg, #d8dbe0, #f4f5f7)", shadow: "inset 0 3px 6px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.8)" },
    solid: { gradient: "linear-gradient(180deg, #8a6df2, #5a38d6)", borderColor: "#4a2cb8", shadow: "0 3px 6px rgba(40,20,120,0.45), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -2px 3px rgba(20,0,90,0.35)" },
  },
  darkEffects: {
    card: { gradient: "linear-gradient(180deg, #4a4d54, #34363b)", borderColor: "#202226", shadow: "0 3px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -2px 3px rgba(0,0,0,0.35)" },
    control: { gradient: "linear-gradient(180deg, #5a5d65, #3d3f45)", borderColor: "#1d1e21", shadow: "0 2px 5px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 3px rgba(0,0,0,0.4)" },
    pressed: { gradient: "linear-gradient(180deg, #2f3135, #3b3d43)", shadow: "inset 0 3px 7px rgba(0,0,0,0.6)" },
    field: { gradient: "linear-gradient(180deg, #101113, #1c1d20)", shadow: "inset 0 3px 7px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.08)" },
    solid: { gradient: "linear-gradient(180deg, #bdaeff, #8f78f5)", borderColor: "#5e48c8", shadow: "0 3px 7px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -2px 3px rgba(40,20,120,0.4)" },
  },
};
