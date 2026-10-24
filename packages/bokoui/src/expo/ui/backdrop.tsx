import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { gradientStyle } from "../effects";
import { useTheme } from "../theme";

export interface BackdropProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * The page behind the app: the style's background color and, for gradient and glass styles, its gradient or
 * mesh of glows. Render it as the first child of the root view (it fills the parent and ignores touches), and
 * leave the screens above it transparent so the glass panels have something to frost.
 */
export function Backdrop({ style }: BackdropProps) {
  const { tokens } = useTheme();
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: tokens.bg }, gradientStyle(tokens.effects.page?.gradient), style]} />;
}

export { Surface, useSurfaceEffect } from "../internal/surface";
export type { SurfaceKind, SurfaceProps } from "../internal/surface";
