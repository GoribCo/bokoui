import { Animated, View, type StyleProp, type ViewStyle, type DimensionValue } from "react-native";
import { type SkeletonShape } from "@/core";
import { useTheme } from "../theme";
import { useLoop } from "../internal/motion";

export interface SkeletonProps {
  shape?: SkeletonShape;
  width?: DimensionValue;
  height?: DimensionValue;
  style?: StyleProp<ViewStyle>;
}

const skeletonShape: Record<SkeletonShape, { width: DimensionValue; height: number }> = {
  text: { width: "100%", height: 16 },
  rect: { width: "100%", height: 96 },
  circle: { width: 40, height: 40 },
};

/** A pulsing placeholder. Decorative: hidden from screen readers. */
export function Skeleton({ shape = "text", width, height, style }: SkeletonProps) {
  const { tokens } = useTheme();
  const pulse = useLoop(800, "pulse");
  const base = skeletonShape[shape];
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width: width ?? base.width,
          height: height ?? base.height,
          borderRadius: shape === "circle" ? 999 : shape === "rect" ? tokens.radiusCard : tokens.radiusControl,
          backgroundColor: tokens.muted,
          opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }),
        },
        style,
      ]}
    />
  );
}

export interface SkeletonTextProps {
  lines?: number;
  style?: StyleProp<ViewStyle>;
}

/** Paragraph placeholder: full-width lines with a shorter last one. */
export function SkeletonText({ lines = 3, style }: SkeletonTextProps) {
  return (
    <View style={[{ alignSelf: "stretch", gap: 8 }, style]}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} width={i === lines - 1 && lines > 1 ? "60%" : "100%"} />
      ))}
    </View>
  );
}
