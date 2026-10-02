import { Card, Text } from "bokoui/expo/ui";
import { mix, useTheme, withAlpha } from "bokoui/expo";
import { ArrowDown, ArrowUp } from "lucide-react-native";
import type { ReactNode } from "react";
import { View } from "react-native";

export interface StatCardProps {
  label: string;
  /** Already formatted. */
  value: string;
  /** Change in percent; positive is green with an up arrow, negative red with a down arrow. */
  delta: number;
  /** Footer text on the right, e.g. "Last 30 days". */
  period: string;
  icon: ReactNode;
}

/** One number with its label, change and period: small gray label, large value, tiny colored delta. */
export function StatCard({ label, value, delta, period, icon }: StatCardProps) {
  const { tokens } = useTheme();
  const up = delta >= 0;
  const color = mix(up ? tokens.success : tokens.danger, tokens.fg, 0.55);
  const Arrow = up ? ArrowUp : ArrowDown;
  return (
    <Card padding="none" style={{ borderWidth: 0, gap: 0, overflow: "hidden" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14 }}>
        <View style={{ width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: withAlpha(tokens.fg, 0.06) }}>{icon}</View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text variant="caption" muted numberOfLines={1}>
            {label}
          </Text>
          <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} style={{ fontSize: 20, lineHeight: 26, fontWeight: "600" }}>
            {value}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 8, backgroundColor: withAlpha(tokens.fg, 0.04) }}>
        <View accessibilityLabel={`${up ? "+" : "-"}${Math.abs(delta)}%`} style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Text variant="caption" style={{ color, fontWeight: "600" }}>
            {up ? "+" : "-"}
            {Math.abs(delta)}%
          </Text>
          <Arrow size={12} color={color} />
        </View>
        <Text variant="caption" muted>
          {period}
        </Text>
      </View>
    </Card>
  );
}
