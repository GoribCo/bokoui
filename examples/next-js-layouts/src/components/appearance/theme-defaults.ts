import { MODE_KEY, STYLE_KEY } from "bokoui/react";

/**
 * Script text that gives a first-time visitor the configured style and mode by seeding the choice that
 * bokoui stores. Runs before `ThemeScript`; a value the visitor already chose is never overwritten.
 */
export function buildThemeDefaultsScript(style: string, mode: string): string {
  return (
    `try{var l=localStorage;` +
    `if(!l.getItem(${JSON.stringify(STYLE_KEY)}))l.setItem(${JSON.stringify(STYLE_KEY)},${JSON.stringify(style)});` +
    `if(!l.getItem(${JSON.stringify(MODE_KEY)}))l.setItem(${JSON.stringify(MODE_KEY)},${JSON.stringify(mode)})}catch(e){}`
  );
}
