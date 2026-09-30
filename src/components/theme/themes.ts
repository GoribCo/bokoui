/** Registry of built-in styles. Add an entry here plus a file in src/styles/themes/. */
export const themes = [
  { id: "flat", label: "Flat" },
  { id: "material", label: "Material" },
  { id: "swiss", label: "Swiss" },
  { id: "brutalism", label: "Brutalism" },
  { id: "neo-brutalism", label: "Neo-Brutalism" },
  { id: "monochrome", label: "Monochrome" },
  { id: "oled", label: "Dark / OLED" },
  { id: "fluent", label: "Fluent" },
] as const;

export type BuiltinThemeId = (typeof themes)[number]["id"];
/** A built-in id, or the id of a custom theme passed to ThemeProvider. */
export type ThemeId = BuiltinThemeId | (string & {});

export const defaultTheme: BuiltinThemeId = "flat";

/** `system` follows prefers-color-scheme. */
export type ThemeMode = "light" | "dark" | "system";
export type ResolvedMode = "light" | "dark";
export const modes: readonly ThemeMode[] = ["light", "dark", "system"];

export const STYLE_KEY = "ui-theme-style";
export const MODE_KEY = "ui-theme-mode";

type ToneName =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";

/** Token names (without the `--ui-` prefix) a custom theme may set. */
export type TokenName =
  | "bg"
  | "fg"
  | "surface"
  | "muted"
  | "muted-fg"
  | "border"
  | "field"
  | "field-border"
  | "ring"
  | ToneName
  | `${ToneName}-fg`
  | "hover-mix"
  | "active-mix"
  | "shadow-color"
  | "radius-control"
  | "radius-button"
  | "border-width"
  | "border-strength"
  | "ink-tone"
  | "shadow-button"
  | "shadow-button-hover"
  | "shift-hover"
  | "shift-active"
  | "font"
  | "btn-weight"
  | "btn-transform"
  | "btn-tracking"
  | "ring-width"
  | "ring-offset"
  | "duration"
  | "ease"
  | "disabled-opacity";

export type TokenMap = Partial<Record<TokenName, string>>;

export interface CustomTheme {
  label: string;
  /** Built-in style whose CSS supplies every token not overridden here. Default: flat. */
  base?: BuiltinThemeId;
  /** Applied in both modes. */
  tokens?: TokenMap;
  light?: TokenMap;
  dark?: TokenMap;
}

export type CustomThemes = Record<string, CustomTheme>;
