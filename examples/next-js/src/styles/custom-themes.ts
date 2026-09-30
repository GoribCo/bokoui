import type { CustomThemes } from "bokoui/theme";

/** Example of a user-defined theme: only the tokens that differ from the base style. */
export const customThemes: CustomThemes = {
  sunset: {
    label: "Sunset (custom)",
    base: "flat",
    tokens: { "radius-button": "9999px", "radius-control": "0.75rem", "btn-weight": "600" },
    light: { primary: "#c2410c", ring: "#c2410c", bg: "#fff7ed", surface: "#ffedd5" },
    dark: { primary: "#fb923c", "primary-fg": "#1c0a00", ring: "#fb923c", bg: "#1c1009", surface: "#2a1810" },
  },
};
