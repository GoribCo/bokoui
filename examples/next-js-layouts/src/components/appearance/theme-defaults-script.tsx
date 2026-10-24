import { siteConfig } from "@/lib/config/site";
import { buildThemeDefaultsScript } from "./theme-defaults";

/** Put in `<head>` before `ThemeScript`. Renders nothing for the library defaults (flat, system). */
export function ThemeDefaultsScript() {
  const { defaultStyle, defaultMode } = siteConfig;
  if (defaultStyle === "flat" && defaultMode === "system") return null;
  return <script dangerouslySetInnerHTML={{ __html: buildThemeDefaultsScript(defaultStyle, defaultMode) }} />;
}
