import { Platform } from "react-native";
import { type NativeCustomTheme } from "../tokens";

const mono = Platform.select({ ios: "Menlo", android: "monospace", default: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace' });

/** Terminal: monospace text, square corners, hairline green borders; phosphor green on black (dark) or ink on paper tape (light). */
export const terminal: NativeCustomTheme = {
  label: "Terminal",
  base: "flat",
  tokens: { "radius-control": "0px", "radius-button": "0px", "radius-card": "0px", "heading-weight": "700", "heading-tracking": "0em", "btn-weight": "700", "ink-tone": "50%", "text-leading": "1.5" },
  light: {
    bg: "#f4f1e4", fg: "#14301c", surface: "#ebe7d6", muted: "#dcd8c4", "muted-fg": "#3e5a46", border: "#8aa08f", field: "#fbf9ef", "field-border": "#4c6b55", ring: "#14301c",
    primary: "#176b34", "primary-fg": "#ffffff", secondary: "#3e5a46", "secondary-fg": "#ffffff", accent: "#8a5a00", "accent-fg": "#ffffff", warning: "#a14a07", "warning-fg": "#ffffff", neutral: "#14301c", "neutral-fg": "#f4f1e4",
  },
  dark: {
    bg: "#070b07", fg: "#7dff9b", surface: "#0d130d", muted: "#142014", "muted-fg": "#6fcf86", border: "#1f5a2c", field: "#070b07", "field-border": "#2f8a45", ring: "#7dff9b",
    primary: "#3ddc67", "primary-fg": "#031006", secondary: "#7dd3fc", "secondary-fg": "#031018", accent: "#ffd166", "accent-fg": "#1a1200", neutral: "#b7f5c6", "neutral-fg": "#031006",
  },
  effects: { fontFamily: mono },
  darkEffects: { card: { shadow: "0 0 0 1px rgba(61,220,103,0.18)" } },
};
