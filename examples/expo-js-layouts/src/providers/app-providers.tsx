import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ToastProvider } from "bokoui/expo/ui";
import { ThemeProvider } from "bokoui/expo";
import { useEffect, useState, type ReactNode } from "react";
import { fontAssets } from "@/lib/fonts/fonts";
import { initI18n } from "@/lib/i18n";
import { installGlobalErrorHandlers } from "@/lib/monitoring/global-handlers";
import { useStoresHydrated } from "@/lib/stores";
import { loadThemeDefaults, type ThemeDefaults } from "@/lib/theme-defaults";
import { customThemes } from "@/styles/custom-themes";
import { QueryProvider } from "./query-provider";
import { SessionExpiry } from "./session-expiry";
import { SessionProvider, useSessionStatus } from "./session-provider";

// Keep the splash screen up until the first frame can be the right one (called at module scope, not awaited).
void SplashScreen.preventAutoHideAsync();
installGlobalErrorHandlers();

/** Loads what the first frame depends on: the saved language and the saved style and mode. */
function useBoot(): ThemeDefaults | null {
  const [defaults, setDefaults] = useState<ThemeDefaults | null>(null);
  useEffect(() => {
    let live = true;
    void Promise.all([initI18n(), loadThemeDefaults()]).then(([, theme]) => {
      if (live) setDefaults(theme);
    });
    return () => {
      live = false;
    };
  }, []);
  return defaults;
}

/** Renders children once the session is known, then lets the splash screen go. */
function SessionGate({ children }: { children: ReactNode }) {
  const status = useSessionStatus();
  const ready = status !== "loading";
  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);
  return ready ? <>{children}</> : null;
}

/**
 * Every provider of the app, in one place. Nothing is rendered until the fonts, the persisted stores, the
 * saved language, the saved theme and the session are ready, so there is no wrong first frame (NFR-2).
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const storesReady = useStoresHydrated();
  const theme = useBoot();

  if (!(fontsLoaded || fontError) || !storesReady || !theme) return null;

  return (
    <ThemeProvider customThemes={customThemes} defaultStyle={theme.style} defaultMode={theme.mode} storage={AsyncStorage}>
      <QueryProvider>
        <SessionProvider>
          <SessionExpiry />
          <ToastProvider placement="bottom-center" offset={32}>
            <SessionGate>{children}</SessionGate>
          </ToastProvider>
        </SessionProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
