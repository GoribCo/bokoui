import { type ReactNode } from "react";
import { Pressable, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { resolveTone, type Action, type Color, type Size, type TagStyleProps } from "@/core";
import { useTheme } from "../theme";
import { isPlainText, surface, tone } from "../internal/shared";

export interface TagProps extends TagStyleProps {
  color?: Color;
  action?: Action;
  children?: ReactNode;
  /** Makes the label pressable (a filter chip). Combine with `pressed` for a toggle. */
  onPress?: () => void;
  pressed?: boolean;
  /** Shows a remove (×) button that calls this. */
  onRemove?: () => void;
  removeLabel?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const tagSizes: Record<Size, { height: number; font: number }> = { sm: { height: 24, font: 12 }, md: { height: 28, font: 14 }, lg: { height: 32, font: 14 } };

export function Tag({ variant = "soft", size = "md", color = "primary", action, children, onPress, pressed, onRemove, removeLabel = "Remove", disabled, style }: TagProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, resolveTone(color, action));
  const s = tagSizes[size];
  const fg = variant === "solid" ? c.fg : c.ink;
  const label = isPlainText(children) ? <RNText style={{ color: fg, fontSize: s.font, flexShrink: 1 }} numberOfLines={1}>{children}</RNText> : children;
  return (
    <View
      style={[
        {
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          height: s.height,
          paddingLeft: 10,
          paddingRight: onRemove ? 4 : 10,
          borderRadius: tokens.radiusButton,
          opacity: disabled ? tokens.disabledOpacity : 1,
          ...surface(variant, c, tokens.borderWidth),
          ...(pressed ? { borderColor: c.base, borderWidth: 2 } : null),
        },
        style,
      ]}
    >
      {onPress ? (
        <Pressable accessibilityRole="button" accessibilityState={{ selected: pressed, disabled }} disabled={disabled} onPress={onPress} hitSlop={8} style={{ flexShrink: 1 }}>
          {label}
        </Pressable>
      ) : (
        label
      )}
      {onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${removeLabel} ${isPlainText(children) ? children : ""}`.trim()}
          disabled={disabled}
          onPress={onRemove}
          hitSlop={12}
          style={{ width: 20, height: 20, alignItems: "center", justifyContent: "center" }}
        >
          <RNText style={{ color: fg, fontSize: 16, lineHeight: 18 }}>×</RNText>
        </Pressable>
      ) : null}
    </View>
  );
}
