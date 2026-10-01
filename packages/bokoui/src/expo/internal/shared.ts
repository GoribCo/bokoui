import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";
import type { Action, Color, Size } from "@/core";
import { mix, withAlpha, type ResolvedTokens } from "../tokens";

/** Palette for one tone: everything a component paints itself with. */
export function tone(t: ResolvedTokens, name: Color | Action) {
  const base = t[name];
  return {
    base,
    fg: t[`${name}Fg`],
    soft: withAlpha(base, 0.16),
    softHover: withAlpha(base, 0.26),
    ink: mix(base, t.fg, name === "warning" ? t.inkToneWarning : t.inkTone),
    border: mix(t.fg, base, t.borderStrength),
  };
}

export type Tone = ReturnType<typeof tone>;

export const sizes: Record<Size, { height: number; padX: number; font: number }> = {
  sm: { height: 32, padX: 12, font: 14 },
  md: { height: 40, padX: 16, font: 14 },
  lg: { height: 48, padX: 24, font: 16 },
};

/** Background and border of a `solid` / `soft` / `outline` surface (Alert, Badge, Tag). */
export function surface(
  variant: "solid" | "soft" | "outline",
  c: Tone,
  borderWidth: number,
): Pick<ViewStyle, "backgroundColor" | "borderColor" | "borderWidth"> {
  return {
    borderWidth,
    backgroundColor: variant === "solid" ? c.base : variant === "soft" ? c.soft : "transparent",
    borderColor: variant === "solid" ? c.border : variant === "outline" ? c.ink : "transparent",
  };
}

/** Strings and numbers become a styled `<Text>`; anything else is rendered as is. */
export const isPlainText = (node: ReactNode): node is string | number => typeof node === "string" || typeof node === "number";
