import { type ReactNode } from "react";
import { Image as RNImage, StyleSheet, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { resolveTone, getInitials, type Action, type Color, type Size, type AvatarShape } from "@/core";
import { useTheme } from "../theme";
import { tone } from "../internal/shared";

export interface AvatarProps {
  size?: Size;
  shape?: AvatarShape;
  /** Image URL; the initials show behind it until it loads. */
  src?: string;
  name?: string;
  color?: Color;
  action?: Action;
  status?: boolean;
  statusAction?: Action;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const avatarPx: Record<Size, { box: number; font: number }> = {
  sm: { box: 32, font: 12 },
  md: { box: 40, font: 14 },
  lg: { box: 48, font: 16 },
};

export function Avatar({
  size = "md",
  shape = "circle",
  src,
  name,
  color = "neutral",
  action,
  status,
  statusAction = "success",
  children,
  style,
}: AvatarProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, resolveTone(color, action));
  const { box, font } = avatarPx[size];
  const radius = shape === "circle" ? box / 2 : tokens.radiusControl;
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={name}
      style={[{ width: box, height: box }, style]}
    >
      <View
        style={{
          width: box,
          height: box,
          borderRadius: radius,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: c.soft,
        }}
      >
        {children ?? <RNText style={{ color: c.ink, fontSize: font, fontWeight: "500" }}>{getInitials(name).toUpperCase()}</RNText>}
        {src ? <RNImage source={{ uri: src }} accessibilityIgnoresInvertColors style={StyleSheet.absoluteFill} /> : null}
      </View>
      {status ? (
        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: tone(tokens, statusAction).base,
            borderWidth: 2,
            borderColor: tokens.bg,
          }}
        />
      ) : null}
    </View>
  );
}
