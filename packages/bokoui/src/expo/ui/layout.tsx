import { Children, useState, type ReactNode } from "react";
import { View, useWindowDimensions, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import type { ContainerStyleProps, Gap, GridStyleProps, InlineStyleProps, StackStyleProps } from "@/core";

// Layout primitives: arrange children only (gap, wrap, columns, max width), no colors.
// Gap keys follow Tailwind's spacing scale (1 = 4px), same as the web recipes in core.
const px = (gap: Gap) => gap * 4;

const align = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" } as const;
const justify = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" } as const;

export type StackProps = ViewProps & StackStyleProps;

/** Children in a column with a gap. */
export function Stack({ gap = 4, align: a = "stretch", style, ...props }: StackProps) {
  return <View style={[{ flexDirection: "column", gap: px(gap), alignItems: align[a] }, style]} {...props} />;
}

export type InlineProps = ViewProps & InlineStyleProps;

/** Children in a wrapping row with a gap: button rows, tag lists, toolbars. */
export function Inline({ gap = 3, align: a = "center", justify: j = "start", style, ...props }: InlineProps) {
  return <View style={[{ flexDirection: "row", flexWrap: "wrap", gap: px(gap), alignItems: align[a], justifyContent: justify[j] }, style]} {...props} />;
}

export type ContainerProps = ViewProps & ContainerStyleProps;

const containerMax = { sm: 672, md: 896, lg: 1152, xl: 1280, full: undefined } as const;

/** Centers content with a max width and responsive side padding. */
export function Container({ size = "lg", style, ...props }: ContainerProps) {
  const { width } = useWindowDimensions();
  return <View style={[{ alignSelf: "center", width: "100%", maxWidth: containerMax[size], paddingHorizontal: width >= 640 ? 24 : 16 }, style]} {...props} />;
}

export type GridProps = ViewProps & GridStyleProps & { children?: ReactNode; style?: StyleProp<ViewStyle> };

/** Columns for a window width, mirroring the CSS breakpoints of the web `gridVariants` (sm 640, lg 1024). */
function columnCount(cols: NonNullable<GridStyleProps["cols"]>, window: number, container: number, gap: number) {
  if (cols === "auto") return Math.max(1, Math.floor((container + gap) / (256 + gap)));
  if (cols === 1) return 1;
  if (cols === 2) return window >= 640 ? 2 : 1;
  if (cols === 3) return window >= 1024 ? 3 : window >= 640 ? 2 : 1;
  return window >= 1024 ? 4 : 2;
}

/** Responsive columns. Each child becomes one cell; for anything more specific, use plain `View`s. */
export function Grid({ gap = 4, cols = 3, children, style, onLayout, ...props }: GridProps) {
  const { width: window } = useWindowDimensions();
  const [width, setWidth] = useState(window);
  const g = px(gap);
  const count = columnCount(cols, window, width, g);
  const cell = (width - g * (count - 1)) / count;
  return (
    <View
      style={[{ flexDirection: "row", flexWrap: "wrap", gap: g }, style]}
      onLayout={(e) => {
        setWidth(e.nativeEvent.layout.width);
        onLayout?.(e);
      }}
      {...props}
    >
      {Children.toArray(children).map((child, i) => (
        <View key={i} style={{ width: Math.floor(cell) }}>
          {child}
        </View>
      ))}
    </View>
  );
}
