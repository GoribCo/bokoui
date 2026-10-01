import { ActivityIndicator, View } from "react-native";
import { resolveTone, type Action, type Color, type Size } from "@/core";
import { useTheme } from "../theme";
import { tone } from "../internal/shared";

export interface SpinnerProps {
  size?: Size;
  color?: Color;
  action?: Action;
  label?: string;
}

export function Spinner({ size = "md", color = "primary", action, label = "Loading" }: SpinnerProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, resolveTone(color, action));
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator size={size === "sm" ? "small" : "large"} color={c.ink} />
    </View>
  );
}
