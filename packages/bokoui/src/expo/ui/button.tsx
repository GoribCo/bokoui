import { type ReactNode } from "react";
import { ActivityIndicator, Pressable, Text as RNText, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { resolveTone, type Action, type Color, type Size, type Variant } from "@/core";
import { useTheme } from "@/expo";
import { effectStyle } from "@/expo";
import { applyMix } from "../tokens";
import { sizes, tone } from "../internal/shared";

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
  // The style's material: a glossy fill for solid buttons, a raised (pressed: sunken) body for soft and outline ones.
  const fx = tokens.effects;
  const raised = variant === "soft" || variant === "outline";
  const material = (pressed: boolean): ViewStyle | null =>
    solid && fx.solid
      ? { ...effectStyle(fx.solid), ...(pressed && fx.pressed?.shadow ? { boxShadow: fx.pressed.shadow } : null) }
      : raised && fx.control
        ? {
            // A material body is a surface, not a tint of the tone: the tone only colors the label.
            backgroundColor: pressed ? tokens.muted : tokens.surface,
            ...effectStyle(pressed && fx.pressed ? { ...fx.control, ...fx.pressed } : fx.control),
          }
        : null;

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
          ...material(pressed),
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
            fontFamily: tokens.fontFamily,
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
