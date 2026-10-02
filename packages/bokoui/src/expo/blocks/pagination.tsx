import { Pressable, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { resolveTone, getPageRange, type Action, type Color, type Size, type PaginationStyleProps } from "@/core";
import { useTheme } from "../theme";
import { tone } from "../internal/shared";

export interface PaginationProps extends PaginationStyleProps {
  /** Current page, 1-based. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Pages shown either side of the current one. Default 1. */
  siblings?: number;
  color?: Color;
  action?: Action;
  /** Hide the previous/next buttons. */
  hideEdges?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

const pageFont: Record<Size, number> = { sm: 12, md: 14, lg: 16 };

export function Pagination({ page, pageCount, onPageChange, siblings = 1, size = "md", color = "primary", action, hideEdges = false, label = "Pagination", style }: PaginationProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, resolveTone(color, action));
  const control = (target: number, content: string, name: string, disabled: boolean, current = false) => (
    <Pressable
      key={name}
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityState={{ selected: current, disabled }}
      disabled={disabled}
      onPress={() => onPageChange(target)}
      style={({ pressed }) => ({
        minWidth: 44,
        height: 44,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: tokens.radiusButton,
        borderWidth: tokens.borderWidth,
        borderColor: current ? c.border : "transparent",
        backgroundColor: current ? c.base : pressed ? c.soft : "transparent",
        opacity: disabled ? tokens.disabledOpacity : 1,
      })}
    >
      <RNText style={{ color: current ? c.fg : tokens.fg, fontSize: pageFont[size], fontWeight: current ? "600" : "400" }}>{content}</RNText>
    </Pressable>
  );
  return (
    <View accessibilityRole="toolbar" accessibilityLabel={label} style={[{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 4 }, style]}>
      {!hideEdges && control(page - 1, "‹", "Previous page", page <= 1)}
      {getPageRange(page, pageCount, siblings).map((item) =>
        typeof item === "number" ? (
          control(item, String(item), `Page ${item}`, false, item === page)
        ) : (
          <RNText key={item} accessibilityElementsHidden importantForAccessibility="no" style={{ minWidth: 32, textAlign: "center", color: tokens.mutedFg }}>
            …
          </RNText>
        ),
      )}
      {!hideEdges && control(page + 1, "›", "Next page", page >= pageCount)}
    </View>
  );
}
