import { useControllable } from "../internal/use-controllable";
import { Pressable, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { type Action, type Color, type Size, type RatingStyleProps } from "@/core";
import { useTheme } from "../theme";
import { useTone } from "../internal/shared";

export interface RatingProps extends RatingStyleProps {
  /** Selected stars (controlled). 0 = none. */
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  /** Display only: a single image with a text alternative. */
  readOnly?: boolean;
  color?: Color;
  action?: Action;
  /** Accessible name, e.g. "Rate this product". */
  label?: string;
  style?: StyleProp<ViewStyle>;
}

const starPx: Record<Size, number> = { sm: 16, md: 20, lg: 28 };

export function Rating({ value, defaultValue = 0, onValueChange, max = 5, readOnly = false, size = "md", color = "primary", action, label = "Rating", style }: RatingProps) {
  const { tokens } = useTheme();
  const c = useTone(color, action);
  const [current, set] = useControllable(value, defaultValue, onValueChange);
  const px = starPx[size];
  const star = (n: number) => (
    <RNText style={{ color: n <= current ? c.base : tokens.mutedFg, opacity: n <= current ? 1 : 0.4, fontSize: px, lineHeight: px * 1.2 }}>{n <= current ? "★" : "☆"}</RNText>
  );
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  if (readOnly) {
    return (
      <View accessible accessibilityRole="image" accessibilityLabel={`${label}: ${current} out of ${max}`} style={[{ flexDirection: "row", gap: 2 }, style]}>
        {stars.map((n) => (
          <View key={n}>{star(n)}</View>
        ))}
      </View>
    );
  }
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={[{ flexDirection: "row", gap: 2 }, style]}>
      {stars.map((n) => (
        <Pressable
          key={n}
          accessibilityRole="radio"
          accessibilityLabel={`${n} out of ${max}`}
          accessibilityState={{ checked: n === current }}
          // Pressing the selected star again clears the rating, like the web version's Delete key.
          onPress={() => set(n === current ? 0 : n)}
          hitSlop={4}
          style={{ minWidth: 36, minHeight: 44, alignItems: "center", justifyContent: "center" }}
        >
          {star(n)}
        </Pressable>
      ))}
    </View>
  );
}
