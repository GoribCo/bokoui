import { useMemo } from "react";
import { View } from "react-native";
import { findActiveTrail } from "@/lib/menu";
import type { MenuGroup } from "@/lib/types";
import { MenuGroupSection } from "./menu-group-section";

export interface MenuTreeProps {
  /** Menu with labels resolved (see `useMenu`). */
  groups: MenuGroup[];
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
  onRequestExpand?: () => void;
}

/** All groups of a menu with the current screen marked and its parents open. */
export function MenuTree({ groups, pathname, collapsed = false, onNavigate, onRequestExpand }: MenuTreeProps) {
  const trail = useMemo(() => findActiveTrail(groups, pathname), [groups, pathname]);
  // Rows deeper than the nested level are not shown: their nearest visible ancestor stands for them.
  const trailIds = useMemo(() => trail?.items.slice(0, 2).map((item) => item.id) ?? [], [trail]);
  const activeItemId = trailIds.at(-1);
  return (
    <View style={{ gap: 8 }}>
      {groups.map((group) => (
        <MenuGroupSection
          key={group.id}
          group={group}
          activeItemId={trail?.group.id === group.id ? activeItemId : undefined}
          trailIds={trail?.group.id === group.id ? trailIds : []}
          collapsed={collapsed}
          onNavigate={onNavigate}
          onRequestExpand={onRequestExpand}
        />
      ))}
    </View>
  );
}
