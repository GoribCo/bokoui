import {
  defaultTheme,
  type CustomThemes,
  type ResolvedMode,
  type ThemeId,
} from "./themes";

const TRANSITION_MS = 300;
let transitionTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Writes the theme onto <html>. Mirrors the inline script in theme-script.tsx,
 * which does the same thing before first paint.
 */
export function applyTheme(
  style: ThemeId,
  mode: ResolvedMode,
  customThemes: CustomThemes,
  animate: boolean,
) {
  const root = document.documentElement;

  if (animate) {
    root.setAttribute("data-theme-transition", "");
    clearTimeout(transitionTimer);
    transitionTimer = setTimeout(
      () => root.removeAttribute("data-theme-transition"),
      TRANSITION_MS,
    );
  }

  const custom = customThemes[style];
  root.dataset.theme = custom ? (custom.base ?? defaultTheme) : style;
  root.dataset.mode = mode;
  root.style.colorScheme = mode;

  for (const prop of (root.dataset.customVars ?? "").split(",")) {
    if (prop) root.style.removeProperty(prop);
  }
  const tokens = custom ? { ...custom.tokens, ...custom[mode] } : {};
  const applied: string[] = [];
  for (const [name, value] of Object.entries(tokens)) {
    root.style.setProperty(`--ui-${name}`, value);
    applied.push(`--ui-${name}`);
  }
  root.dataset.customVars = applied.join(",");
}
