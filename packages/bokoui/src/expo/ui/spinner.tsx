import { ActivityIndicator, View } from "react-native";
import { type Action, type Color, type Size } from "@/core";
import { useTone } from "../internal/shared";

export interface SpinnerProps {
  size?: Size;
  color?: Color;
  action?: Action;
  label?: string;
}

export function Spinner({ size = "md", color = "primary", action, label = "Loading" }: SpinnerProps) {
  const c = useTone(color, action);
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator size={size === "sm" ? "small" : "large"} color={c.ink} />
    </View>
  );
}
