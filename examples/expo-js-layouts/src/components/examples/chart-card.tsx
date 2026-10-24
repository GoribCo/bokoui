import { Card, Text } from "bokoui/expo/ui";
import { mix, useTheme, withAlpha } from "bokoui/expo";
import type { ReactNode } from "react";
import { View } from "react-native";

export interface ChartCardProps {
  title: string;
  /** Period chip on the right, e.g. "This year". */
  period?: string;
  /** Headline number, already formatted. */
  value?: string;
  /** Change in percent next to the headline. */
  delta?: number;
  caption?: string;
  children: ReactNode;
}

/** A card for one chart: title and period chip, a headline number with its change, then the chart. */
export function ChartCard({ title, period, value, delta, caption, children }: ChartCardProps) {
  const { tokens } = useTheme();
  const color = mix(tokens.success, tokens.fg, 0.55);
  return (
    <Card style={{ borderWidth: 0, gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <Text variant="small" muted style={{ flexShrink: 1 }}>
          {title}
        </Text>
        {period ? (
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: withAlpha(tokens.fg, 0.06) }}>
            <Text variant="caption" muted>
              {period}
            </Text>
          </View>
        ) : null}
      </View>
      {value ? (
        <View>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
            <Text style={{ fontSize: 24, lineHeight: 30, fontWeight: "600" }}>{value}</Text>
            {delta !== undefined ? (
              <Text variant="caption" style={{ color, fontWeight: "600" }}>
                +{delta}%
              </Text>
            ) : null}
          </View>
          {caption ? (
            <Text variant="caption" muted>
              {caption}
            </Text>
          ) : null}
        </View>
      ) : null}
      {children}
    </Card>
  );
}
