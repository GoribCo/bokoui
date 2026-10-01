import { type ReactNode } from "react";
import { Pressable, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { resolveTone, type Action, type Color, type AlertVariant } from "@/core";
import { useTheme } from "../theme";
import { isPlainText, surface, tone } from "../internal/shared";

export interface AlertProps {
  variant?: AlertVariant;
  color?: Color;
  action?: Action;
  title?: string;
  /** Description; a string, or your own content. */
  children?: ReactNode;
  icon?: ReactNode;
  /** Shows a close button that calls this. */
  onClose?: () => void;
  closeLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function Alert({ variant = "soft", color = "neutral", action, title, children, icon, onClose, closeLabel = "Dismiss", style }: AlertProps) {
  const { tokens } = useTheme();
  const name = resolveTone(color, action);
  const c = tone(tokens, name);
  const solid = variant === "solid";
  const text = solid ? c.fg : tokens.fg;
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion={name === "danger" || name === "warning" ? "assertive" : "polite"}
      style={[
        {
          alignSelf: "stretch",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 12,
          padding: 16,
          borderRadius: tokens.radiusCard,
          ...surface(variant, c, tokens.borderWidth),
        },
        style,
      ]}
    >
      {icon}
      <View style={{ flex: 1, gap: 4 }}>
        {title ? <RNText style={{ color: text, fontSize: 14, fontWeight: "600" }}>{title}</RNText> : null}
        {isPlainText(children) ? <RNText style={{ color: text, fontSize: 14 }}>{children}</RNText> : children}
      </View>
      {onClose ? (
        <Pressable accessibilityRole="button" accessibilityLabel={closeLabel} onPress={onClose} hitSlop={12}>
          <RNText style={{ color: text, fontSize: 18, lineHeight: 20 }}>×</RNText>
        </Pressable>
      ) : null}
    </View>
  );
}
