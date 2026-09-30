import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import {
  defaultTheme,
  modes,
  themes,
  type CustomThemes,
  type ResolvedMode,
  type ThemeId,
  type ThemeMode,
} from "@/core";
import { resolveTokens, type ResolvedTokens } from "./tokens";

/** AsyncStorage-compatible persistence (optional). */
export interface ThemeStorage {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
}

export interface NativeThemeContextValue {
  style: ThemeId;
  mode: ThemeMode;
  resolvedMode: ResolvedMode;
  themes: readonly { id: string; label: string }[];
  tokens: ResolvedTokens;
  setStyle: (style: ThemeId) => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<NativeThemeContextValue | null>(null);

const STYLE_KEY = "bokoui-theme-style";
const MODE_KEY = "bokoui-theme-mode";
const EMPTY: CustomThemes = {};

export function ThemeProvider({
  children,
  customThemes = EMPTY,
  defaultStyle = defaultTheme,
  defaultMode = "system",
  storage,
}: {
  children: ReactNode;
  /** User-defined themes keyed by id. Pass a stable reference. */
  customThemes?: CustomThemes;
  defaultStyle?: ThemeId;
  defaultMode?: ThemeMode;
  /** e.g. `@react-native-async-storage/async-storage`; without it the choice lasts for the session. */
  storage?: ThemeStorage;
}) {
  const [style, setStyleState] = useState<ThemeId>(defaultStyle);
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const system = useColorScheme();

  const options = useMemo(
    () => [...themes, ...Object.entries(customThemes).map(([id, t]) => ({ id, label: t.label }))],
    [customThemes],
  );

  useEffect(() => {
    if (!storage) return;
    let live = true;
    Promise.all([storage.getItem(STYLE_KEY), storage.getItem(MODE_KEY)]).then(([s, m]) => {
      if (!live) return;
      if (s && options.some((o) => o.id === s)) setStyleState(s);
      if (m && modes.includes(m as ThemeMode)) setModeState(m as ThemeMode);
    });
    return () => {
      live = false;
    };
  }, [storage, options]);

  const setStyle = useCallback(
    (next: ThemeId) => {
      setStyleState(next);
      void storage?.setItem(STYLE_KEY, next);
    },
    [storage],
  );
  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      void storage?.setItem(MODE_KEY, next);
    },
    [storage],
  );

  const resolvedMode: ResolvedMode = mode === "system" ? (system === "dark" ? "dark" : "light") : mode;
  const tokens = useMemo(() => resolveTokens(style, resolvedMode, customThemes), [style, resolvedMode, customThemes]);

  const value = useMemo(
    () => ({ style, mode, resolvedMode, themes: options, tokens, setStyle, setMode }),
    [style, mode, resolvedMode, options, tokens, setStyle, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): NativeThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within <ThemeProvider>");
  return context;
}
