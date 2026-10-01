/** Font choices for the optional switcher. Plain data, so client code can import it (unlike `lib/fonts.ts`). */
export interface FontOption {
  /** Value of `data-font` on `<html>`; "default" removes it and keeps the active style's own font. */
  id: string;
  label: string;
}

export const DEFAULT_FONT_ID = "default";
export const FONT_STORAGE_KEY = "layout-font";

/** Each non-default id needs a matching `:root[data-font="..."]` rule in `styles/typography.css`. */
export const fontOptions: FontOption[] = [
  { id: DEFAULT_FONT_ID, label: "" },
  { id: "geist", label: "Geist" },
  { id: "roboto", label: "Roboto" },
  { id: "system", label: "System UI" },
];

/** Root text size steps of the display settings (value of `data-font-size` on `<html>`). */
export const fontSizes = ["sm", "md", "lg"] as const;
export type FontSize = (typeof fontSizes)[number];
export const DEFAULT_FONT_SIZE: FontSize = "md";
export const FONT_SIZE_STORAGE_KEY = "layout-font-size";
