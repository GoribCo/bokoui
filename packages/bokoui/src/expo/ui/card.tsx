import { View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { type CardPadding, type CardVariant } from "@/core";
import { useTheme } from "../theme";
import { Surface } from "../internal/surface";

export interface CardProps extends Omit<ViewProps, "style"> {
  variant?: CardVariant;
  padding?: CardPadding;
  style?: StyleProp<ViewStyle>;
}

const cardPad: Record<CardPadding, { pad: number; gap: number }> = {
  none: { pad: 0, gap: 0 },
  sm: { pad: 12, gap: 12 },
  md: { pad: 16, gap: 16 },
  lg: { pad: 24, gap: 24 },
};

export function Card({ variant = "outline", padding = "md", style, ...props }: CardProps) {
  const { tokens } = useTheme();
  const { pad, gap } = cardPad[padding];
  const base: ViewStyle = {
    alignSelf: "stretch",
    padding: pad,
    gap,
    borderRadius: tokens.radiusCard,
    borderWidth: tokens.borderWidth,
    borderColor: variant === "filled" ? "transparent" : tokens.border,
    backgroundColor: variant === "filled" ? tokens.muted : tokens.surface,
  };
  // A filled card is a flat tint; only the outlined card takes the style's material (shadows, glass).
  if (variant === "filled") return <View style={[base, style]} {...props} />;
  return <Surface kind="card" style={base} overrideStyle={style} {...props} />;
}

export function CardHeader({ style, ...props }: ViewProps) {
  return <View style={[{ gap: 4 }, style]} {...props} />;
}

export function CardFooter({ style, ...props }: ViewProps) {
  return <View style={[{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 }, style]} {...props} />;
}
