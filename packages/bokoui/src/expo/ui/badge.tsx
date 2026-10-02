import { type ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { type Action, type Color, type Size, type BadgeVariant } from "@/core";
import { useTheme } from "../theme";
import { isPlainText, surface, useTone } from "../internal/shared";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: Size;
  color?: Color;
  action?: Action;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const badgeSizes: Record<Size, { height: number; padX: number; font: number }> = {
  sm: { height: 20, padX: 6, font: 12 },
  md: { height: 24, padX: 8, font: 12 },
  lg: { height: 28, padX: 10, font: 14 },
};

export function Badge({ variant = "soft", size = "md", color = "primary", action, children, style }: BadgeProps) {
  const { tokens } = useTheme();
  const c = useTone(color, action);
  const s = badgeSizes[size];
  const solid = variant === "solid";
  const fg = solid ? c.fg : c.ink;
  return (
    <View
      style={[
        {
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          height: s.height,
          paddingHorizontal: s.padX,
          borderRadius: tokens.radiusButton,
          ...surface(variant, c, tokens.borderWidth),
        },
        style,
      ]}
    >
      {isPlainText(children) ? (
        <RNText style={{ color: fg, fontSize: s.font, fontWeight: String(tokens.btnWeight) as TextStyle["fontWeight"] }}>
          {children}
        </RNText>
      ) : (
        children
      )}
    </View>
  );
}
