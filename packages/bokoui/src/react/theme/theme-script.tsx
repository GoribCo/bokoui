import { buildThemeScript, type CustomThemes } from "@/core";

/** Render in `<head>`: sets the saved theme before first paint. */
export function ThemeScript({ customThemes = {} }: { customThemes?: CustomThemes }) {
  return <script dangerouslySetInnerHTML={{ __html: buildThemeScript(customThemes) }} />;
}
