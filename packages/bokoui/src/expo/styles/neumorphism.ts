import type { NativeCustomTheme } from "@/expo";

/** Neumorphism: surface and page share one color; a light shadow from the top left and a dark one from the bottom right extrude shapes, inset pairs sink them. */
export const neumorphism: NativeCustomTheme = {
  label: "Neumorphism",
  base: "flat",
  tokens: { "radius-control": "1.25rem", "radius-button": "1.25rem", "radius-card": "1.5rem", "border-width": "1px", "ink-tone": "50%", "heading-weight": "700", "heading-tracking": "-0.02em" },
  light: {
    bg: "#e4e8f2", fg: "#1f2540", surface: "#e4e8f2", muted: "#d9deea", "muted-fg": "#4d5670", border: "#e4e8f2", field: "#e4e8f2", "field-border": "#6f7896", ring: "#6d4ae0",
    primary: "#6d4ae0", "primary-fg": "#ffffff", secondary: "#4d5670", accent: "#0b7f70", "accent-fg": "#ffffff", warning: "#b45309", "warning-fg": "#ffffff",
  },
  dark: {
    bg: "#2a2e3d", fg: "#e8ebf6", surface: "#2a2e3d", muted: "#232634", "muted-fg": "#aab1c8", border: "#2a2e3d", field: "#2a2e3d", "field-border": "#7f89a8", ring: "#a794ff",
    primary: "#a794ff", "primary-fg": "#14102e", secondary: "#aab1c8", accent: "#4fd1bd", "accent-fg": "#0b1f1c",
  },
  lightEffects: {
    card: { borderWidth: 0, shadow: "9px 9px 20px #bcc3d4, -9px -9px 20px #ffffff" },
    control: { borderWidth: 0, shadow: "5px 5px 11px #bcc3d4, -5px -5px 11px #ffffff" },
    pressed: { shadow: "inset 4px 4px 9px #bcc3d4, inset -4px -4px 9px #ffffff" },
    field: { shadow: "inset 4px 4px 9px #bcc3d4, inset -4px -4px 9px #ffffff" },
    solid: { gradient: "linear-gradient(145deg, #8460f5, #5f3ad6)", shadow: "6px 6px 14px #bcc3d4, -6px -6px 14px #ffffff" },
  },
  darkEffects: {
    card: { borderWidth: 0, shadow: "9px 9px 20px #1c1f2b, -9px -9px 20px #383d50" },
    control: { borderWidth: 0, shadow: "5px 5px 11px #1c1f2b, -5px -5px 11px #383d50" },
    pressed: { shadow: "inset 4px 4px 9px #1c1f2b, inset -4px -4px 9px #383d50" },
    field: { shadow: "inset 4px 4px 9px #1c1f2b, inset -4px -4px 9px #383d50" },
    solid: { gradient: "linear-gradient(145deg, #b3a3ff, #8c76f5)", shadow: "6px 6px 14px #1c1f2b, -6px -6px 14px #383d50" },
  },
};
