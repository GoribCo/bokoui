import { View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { type CardPadding, type CardVariant } from "@/core";
import { useTheme } from "../theme";
import { surface } from "../internal/shared";

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
  return (
    <View
      style={[
        {
          alignSelf: "stretch",
          padding: pad,
          gap,
          borderRadius: tokens.radiusCard,
          borderWidth: tokens.borderWidth,
          borderColor: variant === "filled" ? "transparent" : tokens.border,
          backgroundColor: variant === "filled" ? tokens.muted : tokens.surface,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function CardHeader({ style, ...props }: ViewProps) {
  return <View style={[{ gap: 4 }, style]} {...props} />;
}

export function CardFooter({ style, ...props }: ViewProps) {
  return <View style={[{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 }, style]} {...props} />;
}
