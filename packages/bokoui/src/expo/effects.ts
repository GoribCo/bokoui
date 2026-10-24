import { Platform, type ViewStyle } from "react-native";

/**
 * Material of one kind of surface, written as CSS-like strings so the same value paints on the web build
 * (react-native-web passes them to CSS) and on devices (React Native parses `boxShadow` and
 * `experimental_backgroundImage` strings). Everything is optional: a style that sets none looks like before.
 */
export interface SurfaceEffect {
  /** Fill, any CSS color including `rgba()` (glass is a translucent fill). Replaces the token color. */
  background?: string;
  /** Gradient fill drawn over `background`, e.g. `linear-gradient(145deg, #fff, #ddd)`. */
  gradient?: string;
  /** Comma-separated shadow layers, outer and `inset`: the raised, pressed and puffy looks. */
  shadow?: string;
  /** Blur of what is behind the surface, in px (glass). A device needs the optional `expo-blur`. */
  blur?: number;
  /** Color saturation of what is behind, in percent (liquid glass). Web only. */
  saturate?: number;
  borderColor?: string;
  borderWidth?: number;
}

/** What sits behind the app: a gradient or a mesh of colored glows (`Backdrop`). */
export interface PageEffect {
  gradient?: string;
}

/**
 * Surface materials of a style. `card` is panels, sheets, bars and cards; `control` raised neutral buttons;
 * `pressed` a control while pressed; `field` text inputs (often sunken); `solid` filled primary buttons.
 */
export interface ThemeEffects {
  card?: SurfaceEffect;
  control?: SurfaceEffect;
  pressed?: SurfaceEffect;
  field?: SurfaceEffect;
  solid?: SurfaceEffect;
  page?: PageEffect;
  /** Font for all text bokoui draws (e.g. a monospace for a terminal style). */
  fontFamily?: string;
}

const web = Platform.OS === "web";

/** CSS gradient string as a style: `backgroundImage` on the web, `experimental_backgroundImage` on a device. */
export const gradientStyle = (css: string | undefined): ViewStyle =>
  !css ? {} : web ? ({ backgroundImage: css } as ViewStyle) : ({ experimental_backgroundImage: css } as ViewStyle);

/**
 * The style a `SurfaceEffect` adds to a view. On a device, blur is drawn by `Surface` (a `BlurView` layer).
 * `opaque` drops the translucent fill and the blur, for surfaces that float over a dimmed backdrop (sheets,
 * dialogs), where a see-through fill would only look gray.
 */
export function effectStyle(effect: SurfaceEffect | undefined, { opaque = false }: { opaque?: boolean } = {}): ViewStyle {
  if (!effect) return {};
  const style: { -readonly [K in keyof ViewStyle]: ViewStyle[K] } & { backdropFilter?: string } = {};
  if (effect.background && !opaque) style.backgroundColor = effect.background;
  if (effect.shadow) style.boxShadow = effect.shadow;
  if (effect.borderColor) style.borderColor = effect.borderColor;
  if (effect.borderWidth !== undefined) style.borderWidth = effect.borderWidth;
  if (web && !opaque && (effect.blur || effect.saturate)) {
    style.backdropFilter = [effect.blur ? `blur(${effect.blur}px)` : "", effect.saturate ? `saturate(${effect.saturate}%)` : ""].filter(Boolean).join(" ");
  }
  return { ...style, ...gradientStyle(effect.gradient) };
}
