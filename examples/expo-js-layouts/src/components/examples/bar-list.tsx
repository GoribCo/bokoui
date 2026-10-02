import { Text } from "bokoui/expo/ui";
import { useTheme, withAlpha } from "bokoui/expo";
import { View } from "react-native";

export interface BarListItem {
  label: string;
  /** 0 to 100. */
  percent: number;
}

/** Horizontal bars on a faint track, one color, the percentage at the end of each row. */
export function BarList({ items }: { items: BarListItem[] }) {
  const { tokens } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      {items.map((item) => (
        <View key={item.label} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text variant="small" muted style={{ width: 64 }} numberOfLines={1}>
            {item.label}
          </Text>
          <View
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={item.label}
            accessibilityValue={{ min: 0, max: 100, now: item.percent }}
            style={{ flex: 1, height: 28, borderRadius: 8, overflow: "hidden", backgroundColor: withAlpha(tokens.fg, 0.08) }}
          >
            <View style={{ width: `${item.percent}%`, height: "100%", borderRadius: 8, backgroundColor: tokens.primary, opacity: 0.85 }} />
          </View>
          <Text variant="caption" muted style={{ width: 36, textAlign: "right" }}>
            {item.percent}%
          </Text>
        </View>
      ))}
    </View>
  );
}
