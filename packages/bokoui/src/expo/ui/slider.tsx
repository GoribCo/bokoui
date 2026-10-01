import { useState, useRef, useMemo } from "react";
import { PanResponder, Text as RNText, View, type StyleProp, type ViewStyle, type AccessibilityActionEvent, type LayoutChangeEvent } from "react-native";
import { resolveTone, type Action, type Color, type Size, type SliderStyleProps } from "@/core";
import { useTheme } from "../theme";
import { surface, tone } from "../internal/shared";

export interface SliderProps extends SliderStyleProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Fires once when the drag ends. */
  onSlidingComplete?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  color?: Color;
  action?: Action;
  label?: string;
  showValue?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const sliderPx: Record<Size, { track: number; thumb: number }> = { sm: { track: 4, thumb: 16 }, md: { track: 6, thumb: 20 }, lg: { track: 8, thumb: 24 } };
const snap = (v: number, min: number, max: number, step: number) => Math.min(max, Math.max(min, min + Math.round((v - min) / step) * step));

export function Slider({
  value,
  defaultValue = 0,
  onValueChange,
  onSlidingComplete,
  min = 0,
  max = 100,
  step = 1,
  size = "md",
  color = "primary",
  action,
  label,
  showValue = false,
  invalid = false,
  disabled = false,
  style,
}: SliderProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, invalid ? "danger" : resolveTone(color, action));
  const [inner, setInner] = useState(defaultValue);
  const [width, setWidth] = useState(0);
  const current = snap(value ?? inner, min, max, step);
  const { track, thumb } = sliderPx[size];
  const ratio = max > min ? (current - min) / (max - min) : 0;

  // The pan responder is created once; it reads the latest inputs through this ref.
  const live = useRef({ width, min, max, step, value: current, set: (_v: number) => {}, done: (_v: number) => {} });
  live.current = {
    width,
    min,
    max,
    step,
    value: current,
    set: (next) => {
      if (next === live.current.value) return;
      if (value === undefined) setInner(next);
      onValueChange?.(next);
    },
    done: (next) => onSlidingComplete?.(next),
  };

  const responder = useMemo(() => {
    const at = (x: number) => {
      const l = live.current;
      return l.width > 0 ? snap(l.min + (Math.min(Math.max(x, 0), l.width) / l.width) * (l.max - l.min), l.min, l.max, l.step) : l.value;
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => live.current.set(at(e.nativeEvent.locationX)),
      onPanResponderMove: (e) => live.current.set(at(e.nativeEvent.locationX)),
      onPanResponderRelease: () => live.current.done(live.current.value),
    });
  }, []);

  const nudge = (e: AccessibilityActionEvent) => {
    const next = snap(current + (e.nativeEvent.actionName === "increment" ? step : -step), min, max, step);
    live.current.set(next);
    onSlidingComplete?.(next);
  };

  return (
    <View style={[{ alignSelf: "stretch", opacity: disabled ? tokens.disabledOpacity : 1 }, style]}>
      {label || showValue ? (
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
          {label ? <RNText style={{ color: tokens.fg, fontSize: 14 }}>{label}</RNText> : <View />}
          {showValue ? <RNText style={{ color: tokens.mutedFg, fontSize: 14 }}>{current}</RNText> : null}
        </View>
      ) : null}
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        accessibilityValue={{ min, max, now: current }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={disabled ? undefined : nudge}
        onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
        {...(disabled ? {} : responder.panHandlers)}
        style={{ height: 44, justifyContent: "center" }}
      >
        <View pointerEvents="none" style={{ height: track, borderRadius: track, backgroundColor: tokens.muted }}>
          <View style={{ width: `${ratio * 100}%`, height: "100%", borderRadius: track, backgroundColor: c.base }} />
        </View>
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: ratio * Math.max(width - thumb, 0),
            width: thumb,
            height: thumb,
            borderRadius: thumb / 2,
            borderWidth: Math.max(tokens.borderWidth, 2),
            borderColor: c.base,
            backgroundColor: tokens.surface,
          }}
        />
      </View>
    </View>
  );
}
