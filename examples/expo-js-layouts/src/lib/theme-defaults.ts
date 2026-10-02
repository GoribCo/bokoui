import AsyncStorage from "@react-native-async-storage/async-storage";
import { modes, themes, type ThemeId, type ThemeMode } from "bokoui/expo";
import { siteConfig } from "@/lib/config";
import { customThemes } from "@/styles/custom-themes";

/** Keys `ThemeProvider` from `bokoui/expo` saves the visitor's choice under. */
const STYLE_KEY = "bokoui-theme-style";
const MODE_KEY = "bokoui-theme-mode";

export interface ThemeDefaults {
  style: ThemeId;
  mode: ThemeMode;
}

const knownStyle = (value: string | null): value is ThemeId =>
  Boolean(value) && (themes.some((theme) => theme.id === value) || value! in customThemes);

const knownMode = (value: string | null): value is ThemeMode => modes.includes(value as ThemeMode);

/**
 * What the first frame should look like: the saved style and mode, else the site's first-visit defaults.
 * `ThemeProvider` reads the same keys after it mounts, which is too late for the first frame, so the app
 * reads them before mounting and passes the result as `defaultStyle` and `defaultMode`.
 */
export async function loadThemeDefaults(): Promise<ThemeDefaults> {
  try {
    const [style, mode] = await Promise.all([AsyncStorage.getItem(STYLE_KEY), AsyncStorage.getItem(MODE_KEY)]);
    return {
      style: knownStyle(style) ? style : siteConfig.defaultStyle,
      mode: knownMode(mode) ? mode : siteConfig.defaultMode,
    };
  } catch {
    return { style: siteConfig.defaultStyle, mode: siteConfig.defaultMode };
  }
}
