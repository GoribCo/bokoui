import { useState, type ReactNode } from "react";
import { TextInput, View, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from "react-native";
import { type Action, type Color, type Size, type InputVariant } from "@/core";
import { useTheme } from "../theme";
import { fieldStyle } from "../internal/field";
import { sizes, useTone } from "../internal/shared";

export interface InputProps extends Omit<TextInputProps, "style"> {
  variant?: InputVariant;
  size?: Size;
  color?: Color;
  action?: Action;
  invalid?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  variant = "outline",
  size = "md",
  color = "primary",
  action,
  invalid = false,
  startAdornment,
  endAdornment,
  editable = true,
  style,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const { tokens } = useTheme();
  const [focused, setFocused] = useState(false);
  const c = useTone(color, action, invalid);
  const s = sizes[size];

  return (
    <View style={[fieldStyle(tokens, c, { variant, size, focused, invalid, disabled: !editable }), containerStyle]}>
      {startAdornment}
      <TextInput
        accessibilityState={{ disabled: !editable }}
        editable={editable}
        placeholderTextColor={tokens.mutedFg}
        {...props}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[{ flex: 1, color: tokens.fg, fontFamily: tokens.fontFamily, fontSize: s.font, paddingVertical: 0 }, style]}
      />
      {endAdornment}
    </View>
  );
}
