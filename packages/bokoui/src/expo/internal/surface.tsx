import { useMemo, type ComponentType, type ReactNode } from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { effectStyle, type SurfaceEffect, type ThemeEffects } from "../effects";
import { useTheme } from "../theme";

type BlurViewType = ComponentType<{ intensity?: number; tint?: "light" | "dark" | "default"; style?: StyleProp<ViewStyle> }>;

declare const require: (id: string) => unknown;

/** `expo-blur` is an optional peer: without it a glass surface on a device falls back to its translucent fill. */
let BlurView: BlurViewType | null = null;
if (Platform.OS !== "web") {
  try {
    BlurView = (require("expo-blur") as { BlurView: BlurViewType }).BlurView;
  } catch {
    BlurView = null;
  }
}

export type SurfaceKind = "card" | "control" | "pressed" | "field" | "solid";

export interface SurfaceProps extends ViewProps {
  kind: SurfaceKind;
  /** Applied after the effect, for a caller that must win (e.g. a one-sided border). */
  overrideStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

/** The effect of a kind in the current style, or `undefined` when the style does not set one. */
export function useSurfaceEffect(kind: SurfaceKind): SurfaceEffect | undefined {
  const { tokens } = useTheme();
  return (tokens.effects as ThemeEffects)[kind];
}

/**
 * A view that paints the style's material for `kind` (fill, gradient, shadows, blur) on top of `style`, which
 * should hold the layout, radius and token colors the surface has when the style has no effect.
 */
export function Surface({ kind, style, overrideStyle, children, ...props }: SurfaceProps) {
  const { resolvedMode } = useTheme();
  const effect = useSurfaceEffect(kind);
  const radius = StyleSheet.flatten(style)?.borderRadius;
  const material = useMemo(() => effectStyle(effect), [effect]);
  const nativeBlur = Boolean(effect?.blur) && Boolean(BlurView);
  return (
    <View style={[style, material, nativeBlur ? { overflow: "hidden" } : null, overrideStyle]} {...props}>
      {nativeBlur && BlurView ? (
        <BlurView intensity={Math.min(100, (effect?.blur ?? 0) * 2.5)} tint={resolvedMode === "dark" ? "dark" : "light"} style={[StyleSheet.absoluteFill, { borderRadius: typeof radius === "number" ? radius : 0 }]} />
      ) : null}
      {children}
    </View>
  );
}
