import { Children, createContext, useContext, type ReactNode } from "react";
import { Pressable, ScrollView, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import type { TableStyleProps } from "@/core";
import { useTheme } from "../theme";

// Native has no auto-sized table layout: every cell is a flex column with a minimum width, so
// columns line up across rows. The table scrolls sideways when the columns do not fit.
const TableContext = createContext<Required<TableStyleProps>>({ striped: false, hoverable: false, density: "comfortable" });
const RowContext = createContext<{ head: boolean; stripe: boolean }>({ head: false, stripe: false });

export interface TableProps extends TableStyleProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Minimum width of every column. Default 120. */
  columnWidth?: number;
}

const ColumnWidth = createContext(120);

export function Table({ striped = false, hoverable = false, density = "comfortable", columnWidth = 120, children, style }: TableProps) {
  const { tokens } = useTheme();
  return (
    <TableContext.Provider value={{ striped, hoverable, density }}>
      <ColumnWidth.Provider value={columnWidth}>
        <ScrollView horizontal style={[{ alignSelf: "stretch", borderRadius: tokens.radiusCard, borderWidth: tokens.borderWidth, borderColor: tokens.border }, style]}>
          <View accessibilityRole="grid" style={{ flexGrow: 1 }}>
            {children}
          </View>
        </ScrollView>
      </ColumnWidth.Provider>
    </TableContext.Provider>
  );
}

export function TableCaption({ children }: { children?: ReactNode }) {
  const { tokens } = useTheme();
  return <RNText style={{ paddingHorizontal: 16, paddingVertical: 12, color: tokens.mutedFg, fontSize: 14 }}>{children}</RNText>;
}

export function TableHeader({ children }: { children?: ReactNode }) {
  const { tokens } = useTheme();
  return (
    <RowContext.Provider value={{ head: true, stripe: false }}>
      <View style={{ backgroundColor: tokens.muted }}>{children}</View>
    </RowContext.Provider>
  );
}

export function TableBody({ children }: { children?: ReactNode }) {
  const { striped } = useContext(TableContext);
  return (
    <View>
      {Children.toArray(children).map((child, i) => (
        <RowContext.Provider key={i} value={{ head: false, stripe: striped && i % 2 === 1 }}>
          {child}
        </RowContext.Provider>
      ))}
    </View>
  );
}

export interface TableRowProps {
  onPress?: () => void;
  children?: ReactNode;
}

export function TableRow({ onPress, children }: TableRowProps) {
  const { tokens } = useTheme();
  const { hoverable } = useContext(TableContext);
  const { head, stripe } = useContext(RowContext);
  const rowStyle = (pressed: boolean): ViewStyle => ({
    flexDirection: "row",
    borderBottomWidth: tokens.borderWidth,
    borderColor: tokens.border,
    backgroundColor: pressed && hoverable ? tokens.muted : stripe ? tokens.muted + "66" : "transparent",
  });
  if (onPress && !head) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => rowStyle(pressed)}>
        {children}
      </Pressable>
    );
  }
  return <View style={rowStyle(false)}>{children}</View>;
}

function cellBox(density: "comfortable" | "compact", width: number, numeric?: boolean): ViewStyle {
  return {
    flex: 1,
    minWidth: width,
    paddingHorizontal: 16,
    paddingVertical: density === "compact" ? 8 : 12,
    justifyContent: "center",
    alignItems: numeric ? "flex-end" : "flex-start",
  };
}

export interface TableHeadProps {
  numeric?: boolean;
  /** Sort state; setting it (or `onSort`) makes the header pressable. */
  sort?: "ascending" | "descending" | "none";
  onSort?: () => void;
  children?: ReactNode;
}

export function TableHead({ numeric, sort, onSort, children }: TableHeadProps) {
  const { tokens } = useTheme();
  const { density } = useContext(TableContext);
  const width = useContext(ColumnWidth);
  const arrow = sort === "ascending" ? " ▲" : sort === "descending" ? " ▼" : onSort ? " ↕" : "";
  const label = (
    <RNText style={{ color: tokens.mutedFg, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5 }}>
      {children}
      {arrow}
    </RNText>
  );
  return (
    <View accessibilityRole="header" style={cellBox(density, width, numeric)}>
      {onSort ? (
        <Pressable accessibilityRole="button" accessibilityState={{ selected: sort === "ascending" || sort === "descending" }} onPress={onSort} hitSlop={8}>
          {label}
        </Pressable>
      ) : (
        label
      )}
    </View>
  );
}

export interface TableCellProps {
  numeric?: boolean;
  children?: ReactNode;
}

export function TableCell({ numeric, children }: TableCellProps) {
  const { tokens } = useTheme();
  const { density } = useContext(TableContext);
  const width = useContext(ColumnWidth);
  return (
    <View accessibilityRole="none" style={cellBox(density, width, numeric)}>
      {typeof children === "string" || typeof children === "number" ? <RNText style={{ color: tokens.fg, fontSize: 14 }}>{children}</RNText> : children}
    </View>
  );
}
