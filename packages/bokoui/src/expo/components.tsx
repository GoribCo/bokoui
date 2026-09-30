import { useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text as RNText,
  TextInput,
  View,
  useWindowDimensions,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextProps as RNTextProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import type { Action, Color, Size, Variant } from "@/core";
import { resolveTone } from "@/core";
import type { HeadingLevel, HeadingSize, TextVariant } from "@/core";
import type { InputVariant } from "@/core";
import { useTheme } from "./theme";
import { applyMix, mix, withAlpha, type ResolvedTokens } from "./tokens";

/** Palette for one tone: everything a component paints itself with. */
function tone(t: ResolvedTokens, name: Color | Action) {
  const base = t[name];
  return {
    base,
    fg: t[`${name}Fg`],
    soft: withAlpha(base, 0.16),
    softHover: withAlpha(base, 0.26),
    ink: mix(base, t.fg, t.inkTone),
    border: mix(t.fg, base, t.borderStrength),
  };
}

const sizes: Record<Size, { height: number; padX: number; font: number }> = {
  sm: { height: 32, padX: 12, font: 14 },
  md: { height: 40, padX: 16, font: 14 },
  lg: { height: 48, padX: 24, font: 16 },
};

// --- Button ---

export interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  variant?: Variant;
  color?: Color;
  action?: Action;
  size?: Size;
  iconOnly?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  variant = "solid",
  color = "primary",
  action,
  size = "md",
  iconOnly = false,
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, resolveTone(color, action));
  const s = sizes[size];
  const off = disabled || loading;

  // Foreground color per variant, and background for rest / pressed.
  const solid = variant === "solid";
  const fg = solid ? c.fg : c.ink;
  const bg = (pressed: boolean) => {
    if (solid) return applyMix(c.base, pressed ? tokens.activeMix : "black 0%");
    if (variant === "outline" || variant === "link") return pressed && variant !== "link" ? c.soft : "transparent";
    if (variant === "soft") return pressed ? c.softHover : c.soft;
    return pressed ? c.soft : "transparent"; // ghost
  };
  const borderColor = solid ? c.border : variant === "outline" ? c.ink : "transparent";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: off, busy: loading }}
      disabled={off}
      {...props}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          minHeight: variant === "link" ? undefined : Math.max(s.height, 44),
          minWidth: iconOnly ? 44 : undefined,
          paddingHorizontal: variant === "link" ? 0 : iconOnly ? 0 : s.padX,
          borderRadius: variant === "link" ? 0 : tokens.radiusButton,
          borderWidth: tokens.borderWidth,
          borderColor,
          backgroundColor: bg(pressed),
          opacity: off ? tokens.disabledOpacity : 1,
          alignSelf: fullWidth ? "stretch" : "flex-start",
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={fg} /> : leftIcon}
      {children != null && (
        <RNText
          style={{
            color: fg,
            fontSize: s.font,
            fontWeight: tokens.btnWeight,
            textTransform: tokens.btnTransform,
            letterSpacing: tokens.btnTracking * s.font,
            textDecorationLine: variant === "link" ? "underline" : "none",
          }}
        >
          {children}
        </RNText>
      )}
      {!loading && rightIcon}
    </Pressable>
  );
}

// --- Input ---

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
  const c = tone(tokens, invalid ? "danger" : resolveTone(color, action));
  const s = sizes[size];
  const flushed = variant === "flushed";
  const border = invalid ? c.base : focused ? c.ink : variant === "filled" ? "transparent" : tokens.fieldBorder;

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "stretch",
          minHeight: Math.max(s.height, 44),
          paddingHorizontal: flushed ? 0 : s.padX - 2,
          gap: 8,
          borderRadius: flushed ? 0 : tokens.radiusControl,
          borderWidth: flushed ? 0 : tokens.borderWidth,
          borderBottomWidth: tokens.borderWidth,
          borderColor: border,
          backgroundColor: flushed ? "transparent" : variant === "filled" && !focused ? tokens.muted : tokens.field,
          opacity: editable ? 1 : tokens.disabledOpacity,
        },
        containerStyle,
      ]}
    >
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
        style={[{ flex: 1, color: tokens.fg, fontSize: s.font, paddingVertical: 0 }, style]}
      />
      {endAdornment}
    </View>
  );
}

// --- Typography ---

const headingPx: Record<HeadingSize, [number, number]> = {
  // [base, from 768px wide]
  sm: [16, 16],
  md: [18, 18],
  lg: [20, 20],
  xl: [24, 24],
  "2xl": [24, 30],
  "3xl": [30, 36],
  "4xl": [36, 48],
};
const defaultHeadingSize: Record<HeadingLevel, HeadingSize> = {
  h1: "4xl",
  h2: "3xl",
  h3: "2xl",
  h4: "xl",
  h5: "lg",
  h6: "md",
};

export interface HeadingProps extends RNTextProps {
  /** Semantic level (sets the default size and accessibility heading role). Default `h2`. */
  as?: HeadingLevel;
  size?: HeadingSize;
}

export function Heading({ as = "h2", size, style, ...props }: HeadingProps) {
  const { tokens } = useTheme();
  const { width } = useWindowDimensions();
  const [base, wide] = headingPx[size ?? defaultHeadingSize[as]];
  const px = width >= 768 ? wide : base;
  return (
    <RNText
      accessibilityRole="header"
      style={[
        {
          color: tokens.fg,
          fontSize: px,
          lineHeight: px * 1.2,
          fontWeight: tokens.headingWeight,
          letterSpacing: tokens.headingTracking * px,
          textTransform: tokens.headingTransform,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  muted?: boolean;
}

const textPx: Record<TextVariant, number> = { body: 16, lead: 20, small: 14, caption: 12, code: 14 };

export function Text({ variant = "body", muted = false, style, ...props }: TextProps) {
  const { tokens } = useTheme();
  const px = textPx[variant];
  return (
    <RNText
      style={[
        {
          color: muted ? tokens.mutedFg : tokens.fg,
          fontSize: px,
          lineHeight: px * tokens.textLeading,
        },
        variant === "code" && { fontFamily: "Courier", backgroundColor: tokens.muted, borderRadius: tokens.radiusControl },
        style,
      ]}
      {...props}
    />
  );
}

export interface LinkProps extends RNTextProps {
  /** Opened with `Linking.openURL` on press. */
  href?: string;
  color?: Color;
  action?: Action;
  underline?: "always" | "hover" | "none";
}

export function Link({ href, color = "primary", action, underline = "hover", style, onPress, ...props }: LinkProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, resolveTone(color, action));
  return (
    <RNText
      accessibilityRole="link"
      onPress={(e) => {
        onPress?.(e);
        if (href) void Linking.openURL(href);
      }}
      style={[{ color: c.ink, textDecorationLine: underline === "none" ? "none" : "underline" }, style]}
      {...props}
    />
  );
}
