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
import {
  applyTheme,
  defaultTheme,
  normalizeMode,
  readMode,
  readStyle,
  subscribeStorage,
  subscribeSystem,
  systemPrefersDark,
  themes,
  writeMode,
  writeStyle,
  type CustomThemes,
  type ResolvedMode,
  type ThemeId,
  type ThemeMode,
} from "@/core";

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
    subscribeStorage,
    readStyle,
    () => null,
  );
  const storedMode = useSyncExternalStore(
    subscribeStorage,
    readMode,
    () => null,
  );
  const systemDark = useSyncExternalStore(
    subscribeSystem,
    systemPrefersDark,
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
  const mode: ThemeMode = normalizeMode(storedMode);
  const resolvedMode: ResolvedMode =
    mode === "system" ? (systemDark ? "dark" : "light") : mode;

  // Applied before paint. Also re-applies after React's dev-mode remount clears <html>.
  const isFirstApply = useRef(true);
  useLayoutEffect(() => {
    applyTheme(style, resolvedMode, custom, !isFirstApply.current);
    isFirstApply.current = false;
  }, [style, resolvedMode, custom]);

  const setStyle = useCallback((next: ThemeId) => writeStyle(next), []);
  const setMode = useCallback((next: ThemeMode) => writeMode(next), []);

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
