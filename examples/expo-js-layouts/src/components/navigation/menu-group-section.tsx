import { Text } from "bokoui/expo/ui";
import { useState } from "react";
import { View } from "react-native";
import type { MenuGroup, MenuItem } from "@/lib/types";
import { MenuItemLink } from "./menu-item-link";

export interface MenuGroupSectionProps {
  group: MenuGroup;
  /** Id of the row that is the current screen. */
  activeItemId?: string;
  /** Ids from the top-level row down to the active row; the rows on it start expanded. */
  trailIds?: readonly string[];
  collapsed?: boolean;
  onNavigate?: () => void;
  /** A collapsed rail was asked to open a row with children: the host expands the rail. */
  onRequestExpand?: () => void;
}

/** A group heading and its rows, each row with at most one nested level that opens as an accordion. */
export function MenuGroupSection({ group, activeItemId, trailIds = [], collapsed = false, onNavigate, onRequestExpand }: MenuGroupSectionProps) {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set(trailIds));

  const toggle = (item: MenuItem) => {
    if (collapsed) {
      onRequestExpand?.();
      setExpanded((current) => new Set(current).add(item.id));
      return;
    }
    setExpanded((current) => {
      const next = new Set(current);
      if (!next.delete(item.id)) next.add(item.id);
      return next;
    });
  };

  return (
    <View style={{ gap: 2 }}>
      {group.label && !collapsed ? (
        <Text accessibilityRole="header" variant="caption" muted style={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.6 }}>
          {group.label}
        </Text>
      ) : null}
      {group.items.map((item) => {
        const open = expanded.has(item.id);
        return (
          <View key={item.id}>
            <MenuItemLink
              item={item}
              active={item.id === activeItemId || (!open && trailIds[0] === item.id && trailIds.length > 1)}
              collapsed={collapsed}
              expanded={open}
              onToggle={toggle}
              onNavigate={onNavigate}
            />
            {open && !collapsed && item.children
              ? item.children.map((child) => (
                  <MenuItemLink key={child.id} item={child} depth={1} active={child.id === activeItemId} onNavigate={onNavigate} />
                ))
              : null}
          </View>
        );
      })}
    </View>
  );
}
