import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";

/**
 * Font registry: the one place where font families are defined (FR-12.1).
 * Each font exposes a CSS variable; `styles/typography.css` maps them to Tailwind's `font-sans`.
 */
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Bengali subset only: the browser uses it for Bangla glyphs and falls through to the UI font for Latin.
const notoSansBengali = Noto_Sans_Bengali({ variable: "--font-noto-bengali", subsets: ["bengali"] });

/** Class names that register every font variable; put them on `<html>`. */
export const fontVariableClassName = [
  geistSans.variable,
  geistMono.variable,
  notoSansBengali.variable,
].join(" ");
