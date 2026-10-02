import type { ViewStyle } from "react-native";
import type { InputVariant, Size } from "@/core";
import type { ResolvedTokens } from "../tokens";
import { effectStyle } from "../effects";
import { sizes, type Tone } from "./shared";

/** Box of a text-field-like control (Input, Select, DatePicker): same look in every state. */
export function fieldStyle(
  tokens: ResolvedTokens,
  c: Tone,
  { variant = "outline", size = "md", focused = false, invalid = false, disabled = false }: { variant?: InputVariant; size?: Size; focused?: boolean; invalid?: boolean; disabled?: boolean },
): ViewStyle {
  const s = sizes[size];
  const flushed = variant === "flushed";
  const base: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: Math.max(s.height, 44),
    paddingHorizontal: flushed ? 0 : s.padX - 2,
    gap: 8,
    borderRadius: flushed ? 0 : tokens.radiusControl,
    borderWidth: flushed ? 0 : tokens.borderWidth,
    borderBottomWidth: tokens.borderWidth,
    borderColor: invalid ? c.base : focused ? c.ink : variant === "filled" ? "transparent" : tokens.fieldBorder,
    backgroundColor: flushed ? "transparent" : variant === "filled" && !focused ? tokens.muted : tokens.field,
    opacity: disabled ? tokens.disabledOpacity : 1,
  };
  // The style's material for text fields (a sunken well, a frosted pane); focus and invalid keep their ring color.
  const fx = effectStyle(tokens.effects.field);
  const ring = invalid || focused ? { borderColor: base.borderColor } : null;
  return flushed ? base : { ...base, ...fx, ...ring };
}
