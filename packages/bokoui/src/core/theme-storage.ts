import { MODE_KEY, STYLE_KEY, modes, defaultTheme, type ThemeMode } from "./themes";

/**
 * Browser-side persistence shared by the React and Vue providers:
 * localStorage (the saved choice) plus prefers-color-scheme.
 * Framework bindings subscribe and re-read; nothing here knows about a framework.
 */

const listeners = new Set<() => void>();
const memory: Record<string, string> = {}; // fallback when storage is blocked

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeStorage(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function readStored(key: string) {
  try {
    return localStorage.getItem(key) ?? memory[key] ?? null;
  } catch {
    return memory[key] ?? null;
  }
}

export function writeStored(key: string, value: string) {
  memory[key] = value;
  try {
    localStorage.setItem(key, value);
  } catch {}
  emit();
}

const darkQuery = "(prefers-color-scheme: dark)";

export function subscribeSystem(listener: () => void) {
  const query = window.matchMedia(darkQuery);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

export const systemPrefersDark = () => window.matchMedia(darkQuery).matches;

export const readStyle = () => readStored(STYLE_KEY);
export const readMode = () => readStored(MODE_KEY);
export const writeStyle = (style: string) => writeStored(STYLE_KEY, style);
export const writeMode = (mode: ThemeMode) => writeStored(MODE_KEY, mode);

export function normalizeMode(stored: string | null): ThemeMode {
  return modes.includes(stored as ThemeMode) ? (stored as ThemeMode) : "system";
}

export function normalizeStyle(stored: string | null, ids: readonly string[]): string {
  return stored && ids.includes(stored) ? stored : defaultTheme;
}
