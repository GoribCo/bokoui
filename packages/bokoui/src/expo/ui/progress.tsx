import { Animated, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { type Action, type Color, type Size, type ProgressStyleProps } from "@/core";
import { useTheme } from "../theme";
import { useTone } from "../internal/shared";
import { useLoop } from "../internal/motion";

export interface ProgressProps extends ProgressStyleProps {
  /** Current value. Omit for an indeterminate (unknown-length) bar. */
  value?: number;
  max?: number;
  color?: Color;
  action?: Action;
  label?: string;
  showValue?: boolean;
  style?: StyleProp<ViewStyle>;
}

const trackHeight: Record<Size, number> = { sm: 6, md: 10, lg: 16 };

export function Progress({ value, max = 100, size = "md", color = "primary", action, label, showValue = false, style }: ProgressProps) {
  const { tokens } = useTheme();
  const c = useTone(color, action);
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0;
  const slide = useLoop(1200, "slide");
  return (
    <View style={[{ alignSelf: "stretch" }, style]}>
      {label || (showValue && !indeterminate) ? (
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
          {label ? <RNText style={{ color: tokens.fg, fontSize: 14 }}>{label}</RNText> : <View />}
          {showValue && !indeterminate ? <RNText style={{ color: tokens.mutedFg, fontSize: 14 }}>{percent}%</RNText> : null}
        </View>
      ) : null}
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={label}
        accessibilityValue={indeterminate ? undefined : { min: 0, max, now: clamped, text: `${percent}%` }}
        style={{ height: trackHeight[size], borderRadius: 999, overflow: "hidden", backgroundColor: tokens.muted }}
      >
        {indeterminate ? (
          <Animated.View
            style={{
              width: "34%",
              height: "100%",
              borderRadius: 999,
              backgroundColor: c.base,
              transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [-120, 360] }) }],
            }}
          />
        ) : (
          <View style={{ width: `${percent}%`, height: "100%", borderRadius: 999, backgroundColor: c.base }} />
        )}
      </View>
    </View>
  );
}
