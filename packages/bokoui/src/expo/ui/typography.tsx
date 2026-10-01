import { Linking, Text as RNText, useWindowDimensions, type TextProps as RNTextProps } from "react-native";
import { resolveTone, type Action, type Color, type HeadingLevel, type HeadingSize, type TextVariant } from "@/core";
import { useTheme } from "../theme";
import { tone } from "../internal/shared";

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
