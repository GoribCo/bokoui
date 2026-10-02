import { Badge, Text, useTheme } from "bokoui/expo";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useNavigate } from "@/hooks/use-navigate";
import { usePrimaryTone } from "@/hooks/use-primary-tone";
import type { MenuItem } from "@/lib/types";
import { MenuIcon } from "./menu-icon";

export interface MenuItemLinkProps {
  item: MenuItem;
  /** This row is the current screen. */
  active?: boolean;
  /** 0 for a top-level row, 1 for the single nested level. */
  depth?: 0 | 1;
  /** Icon-only rail: the label stays as the accessible name. */
  collapsed?: boolean;
  /** The nested rows are showing (rows that have children only). */
  expanded?: boolean;
  /** Called when a row with children is pressed (expand or collapse it). */
  onToggle?: (item: MenuItem) => void;
  /** Called after a row navigated, e.g. to close the drawer. */
  onNavigate?: () => void;
}

/**
 * One row of a menu: icon, label (one line, truncated), badge and, for rows with children, a chevron. A row
 * with its own `href` navigates on press and expands through the chevron; a pure group row expands on press.
 */
export function MenuItemLink({ item, active = false, depth = 0, collapsed = false, expanded = false, onToggle, onNavigate }: MenuItemLinkProps) {
  const { tokens } = useTheme();
  const tone = usePrimaryTone();
  const navigate = useNavigate();
  // Only one nested level is shown; deeper children stay in the data.
  const hasChildren = depth === 0 && Boolean(item.children?.length);
  const color = active ? tone.ink : tokens.fg;

  const open = () => {
    if (!item.href) return;
    navigate(item.href);
    onNavigate?.();
  };
  const press = () => (hasChildren && !item.href ? onToggle?.(item) : open());

  return (
    <View style={{ flexDirection: "row", alignItems: "center", alignSelf: collapsed ? "center" : "stretch" }}>
      <Pressable
        accessibilityRole={hasChildren && !item.href ? "button" : "link"}
        accessibilityLabel={item.label}
        accessibilityState={{ selected: active, expanded: hasChildren ? expanded : undefined, disabled: !item.href && !hasChildren }}
        disabled={!item.href && !hasChildren}
        onPress={press}
        style={({ pressed }) => ({
          flex: collapsed ? undefined : 1,
          minHeight: 44,
          width: collapsed ? 44 : undefined,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 12,
          paddingLeft: collapsed ? 0 : 12 + depth * 20,
          paddingRight: collapsed ? 0 : 12,
          borderRadius: tokens.radiusControl,
          backgroundColor: active ? tone.soft : pressed ? tokens.muted : "transparent",
        })}
      >
        {depth === 0 ? <MenuIcon name={item.icon} color={color} /> : null}
        {collapsed ? null : (
          <>
            <Text numberOfLines={1} style={{ flex: 1, flexShrink: 1, fontSize: 14, fontWeight: active ? "600" : "500", color }}>
              {item.label}
            </Text>
            {item.badge !== undefined ? <Badge size="sm">{String(item.badge)}</Badge> : null}
          </>
        )}
      </Pressable>
      {hasChildren && !collapsed ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={item.label}
          accessibilityState={{ expanded }}
          onPress={() => onToggle?.(item)}
          hitSlop={4}
          style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
        >
          {expanded ? <ChevronDown size={18} color={tokens.mutedFg} /> : <ChevronRight size={18} color={tokens.mutedFg} />}
        </Pressable>
      ) : null}
    </View>
  );
}
