import { Text } from "bokoui/expo/ui";
import { mix, useTheme } from "bokoui/expo";
import { useMemo, useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Rect, Stop } from "react-native-svg";

export interface AreaChartPoint {
  label: string;
  value: number;
}

export interface AreaChartProps {
  data: AreaChartPoint[];
  /** Index of the point to call out with a guide line and a tooltip. */
  highlight?: number;
  /** Formats the tooltip value. */
  format: (value: number) => string;
  /** Accessible summary of the chart (the drawing itself is hidden from screen readers). */
  summary: string;
  height?: number;
}

const PAD = { top: 12, bottom: 24, left: 8, right: 8 };

/** Smooth curve through the points (Catmull-Rom converted to cubic Béziers). */
function curve(points: { x: number; y: number }[]): string {
  return points
    .map((p, i) => {
      if (i === 0) return `M${p.x},${p.y}`;
      const p0 = points[i - 2] ?? points[i - 1];
      const p1 = points[i - 1];
      const p3 = points[i + 1] ?? p;
      const c1x = p1.x + (p.x - p0.x) / 6;
      const c1y = p1.y + (p.y - p0.y) / 6;
      const c2x = p.x - (p3.x - p1.x) / 6;
      const c2y = p.y - (p3.y - p1.y) / 6;
      return `C${c1x},${c1y} ${c2x},${c2y} ${p.x},${p.y}`;
    })
    .join(" ");
}

/** A quiet line-and-area chart: faint dotted guides, tiny axis labels, one highlighted point. */
export function AreaChart({ data, highlight, format, summary, height = 170 }: AreaChartProps) {
  const { tokens } = useTheme();
  const [width, setWidth] = useState(0);
  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  const geometry = useMemo(() => {
    if (width === 0 || data.length < 2) return null;
    const innerW = width - PAD.left - PAD.right;
    const innerH = height - PAD.top - PAD.bottom;
    const max = Math.max(...data.map((d) => d.value));
    const min = Math.min(...data.map((d) => d.value));
    const span = max - min || 1;
    const points = data.map((d, i) => ({
      x: PAD.left + (i / (data.length - 1)) * innerW,
      y: PAD.top + innerH - ((d.value - min) / span) * innerH * 0.85 - innerH * 0.05,
    }));
    const line = curve(points);
    const area = `${line} L${points[points.length - 1].x},${PAD.top + innerH} L${points[0].x},${PAD.top + innerH} Z`;
    return { points, line, area, baseline: PAD.top + innerH };
  }, [data, width, height]);

  const marked = highlight !== undefined && geometry ? geometry.points[highlight] : undefined;
  const guide = mix(tokens.fg, tokens.bg, 0.12);

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={summary} onLayout={onLayout} style={{ height }}>
      {geometry ? (
        <>
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={tokens.primary} stopOpacity={0.22} />
                <Stop offset="1" stopColor={tokens.primary} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            {[0.25, 0.5, 0.75, 1].map((f) => (
              <Line key={f} x1={PAD.left} x2={width - PAD.right} y1={PAD.top + (geometry.baseline - PAD.top) * f} y2={PAD.top + (geometry.baseline - PAD.top) * f} stroke={guide} strokeWidth={1} strokeDasharray="3 4" />
            ))}
            {marked ? <Rect x={marked.x - 18} y={PAD.top} width={36} height={geometry.baseline - PAD.top} rx={8} fill={tokens.primary} opacity={0.12} /> : null}
            <Path d={geometry.area} fill="url(#area)" />
            <Path d={geometry.line} fill="none" stroke={tokens.primary} strokeWidth={2} strokeLinecap="round" />
            {marked ? <Circle cx={marked.x} cy={marked.y} r={5} fill={tokens.surface} stroke={tokens.primary} strokeWidth={2} /> : null}
          </Svg>
          {data.map((d, i) => (
            <Text
              key={d.label}
              variant="caption"
              muted={i !== highlight}
              style={{ position: "absolute", bottom: 0, left: geometry.points[i].x - 16, width: 32, textAlign: "center", fontSize: 11, fontWeight: i === highlight ? "700" : "400" }}
            >
              {d.label}
            </Text>
          ))}
          {marked && highlight !== undefined ? (
            <View
              style={{
                position: "absolute",
                top: Math.max(0, marked.y - 40),
                left: Math.min(Math.max(marked.x - 36, 0), width - 72),
                minWidth: 72,
                alignItems: "center",
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 10,
                backgroundColor: tokens.primary,
              }}
            >
              <Text variant="small" style={{ color: tokens.primaryFg, fontWeight: "600" }}>
                {format(data[highlight].value)}
              </Text>
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}
