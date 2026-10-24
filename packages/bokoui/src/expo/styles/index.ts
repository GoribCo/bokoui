import { type NativeCustomThemes } from "../tokens";
import { aurora } from "./aurora";
import { bento } from "./bento";
import { clay } from "./clay";
import { glass } from "./glass";
import { liquidGlass } from "./liquid-glass";
import { material3 } from "./material3";
import { minimalism } from "./minimalism";
import { neumorphism } from "./neumorphism";
import { skeuomorphism } from "./skeuomorphism";
import { softUi } from "./soft-ui";
import { synthwave } from "./synthwave";
import { terminal } from "./terminal";

/**
 * Styles that ship with `bokoui/expo` on top of the eight shared ones. They are defined in code (colors plus
 * the surface materials of `effects.ts`), so they exist on Expo only. `ThemeProvider` lists them by itself.
 */
export const nativeStyles: NativeCustomThemes = {
  minimalism,
  bento,
  "material-3": material3,
  "soft-ui": softUi,
  neumorphism,
  claymorphism: clay,
  skeuomorphism,
  terminal,
  synthwave,
  glassmorphism: glass,
  "liquid-glass": liquidGlass,
  aurora,
};
