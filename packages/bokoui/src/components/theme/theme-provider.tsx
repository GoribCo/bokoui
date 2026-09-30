"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { applyTheme } from "./apply-theme";
import {
  defaultTheme,
  MODE_KEY,
  modes,
  STYLE_KEY,
  themes,
  type CustomThemes,
  type ResolvedMode,
  type ThemeId,
  type ThemeMode,
} from "./themes";

export interface ThemeOption {
  id: string;
  label: string;
}

export interface ThemeContextValue {
  /** Selected design style. */
  style: ThemeId;
  /** Selected mode, including `system`. */
  mode: ThemeMode;
  /** The mode actually in effect (`system` resolved). */
  resolvedMode: ResolvedMode;
  /** Built-in and custom styles, for building pickers. */
  themes: readonly ThemeOption[];
  setStyle: (style: ThemeId) => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// --- external store: localStorage (persisted choice) + prefers-color-scheme ---

const listeners = new Set<() => void>();
const memory: Record<string, string> = {}; // fallback when storage is blocked

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function read(key: string) {
  try {
    return localStorage.getItem(key) ?? memory[key] ?? null;
  } catch {
    return memory[key] ?? null;
  }
}

function write(key: string, value: string) {
  memory[key] = value;
  try {
    localStorage.setItem(key, value);
  } catch {}
  emit();
}

const darkQuery = "(prefers-color-scheme: dark)";

function subscribeSystem(listener: () => void) {
  const query = window.matchMedia(darkQuery);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

export function ThemeProvider({
  children,
  customThemes,
}: {
  children: ReactNode;
  /** User-defined themes keyed by id (FR-4.7). Pass a stable reference. */
  customThemes?: CustomThemes;
}) {
  const custom = customThemes ?? EMPTY;

  const storedStyle = useSyncExternalStore(
    subscribe,
    () => read(STYLE_KEY),
    () => null,
  );
  const storedMode = useSyncExternalStore(
    subscribe,
    () => read(MODE_KEY),
    () => null,
  );
  const systemDark = useSyncExternalStore(
    subscribeSystem,
    () => window.matchMedia(darkQuery).matches,
    () => false,
  );

  const options = useMemo<ThemeOption[]>(
    () => [
      ...themes,
      ...Object.entries(custom).map(([id, t]) => ({ id, label: t.label })),
    ],
    [custom],
  );

  const style: ThemeId =
    storedStyle && options.some((o) => o.id === storedStyle)
      ? storedStyle
      : defaultTheme;
  const mode: ThemeMode = modes.includes(storedMode as ThemeMode)
    ? (storedMode as ThemeMode)
    : "system";
  const resolvedMode: ResolvedMode =
    mode === "system" ? (systemDark ? "dark" : "light") : mode;

  // Applied before paint. Also re-applies after React's dev-mode remount clears <html>.
  const isFirstApply = useRef(true);
  useLayoutEffect(() => {
    applyTheme(style, resolvedMode, custom, !isFirstApply.current);
    isFirstApply.current = false;
  }, [style, resolvedMode, custom]);

  const setStyle = useCallback((next: ThemeId) => write(STYLE_KEY, next), []);
  const setMode = useCallback((next: ThemeMode) => write(MODE_KEY, next), []);

  const value = useMemo(
    () => ({ style, mode, resolvedMode, themes: options, setStyle, setMode }),
    [style, mode, resolvedMode, options, setStyle, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

const EMPTY: CustomThemes = {};

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within <ThemeProvider>");
  return context;
}
