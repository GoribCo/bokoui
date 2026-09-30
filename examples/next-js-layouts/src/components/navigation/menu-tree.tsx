"use client";

import { useCallback, useMemo, useState } from "react";
import { findActiveTrail } from "@/lib/menu";
import type { MenuGroup } from "@/types";
import { MenuGroupSection } from "./menu-group-section";
import { MenuTreeContext, type MenuTreeContextValue } from "./menu-tree-context";

export interface MenuTreeProps {
  /** Menu with labels already resolved (see `useMenu`). Item ids must be unique within it. */
  groups: MenuGroup[];
  /** Current path; the matching item is highlighted and its parents expand. */
  pathname: string;
  /** Icon-only rail. */
  collapsed?: boolean;
  onNavigate?: () => void;
  onRequestExpand?: () => void;
}

/**
 * The navigation: groups of items with collapsible branches of unbounded depth. Expansion state is
 * local; the parents of the active item open automatically when the path changes (FR-2.4).
 * Give it a `key` (e.g. the organization id) to reset it when the menu is replaced.
 */
export function MenuTree({ groups, pathname, collapsed = false, onNavigate, onRequestExpand }: MenuTreeProps) {
  const trail = useMemo(() => findActiveTrail(groups, pathname), [groups, pathname]);
  const trailIds = useMemo(() => trail?.items.map((item) => item.id) ?? [], [trail]);
  const trailKey = trailIds.join("/");

  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(() => new Set(trailIds));
  const [seenTrailKey, setSeenTrailKey] = useState(trailKey);
  if (seenTrailKey !== trailKey) {
    // New active item: open its parents, keep whatever else the user opened.
    setSeenTrailKey(trailKey);
    setExpandedIds((previous) => new Set([...previous, ...trailIds]));
  }

  const toggle = useCallback((itemId: string) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);
      if (!next.delete(itemId)) next.add(itemId);
      return next;
    });
  }, []);

  const activeItemId = trail?.items.at(-1)?.id ?? null;
  const value = useMemo<MenuTreeContextValue>(
    () => ({ collapsed, activeItemId, expandedIds, toggle, onNavigate, onRequestExpand }),
    [collapsed, activeItemId, expandedIds, toggle, onNavigate, onRequestExpand],
  );

  return (
    <MenuTreeContext.Provider value={value}>
      {groups.map((group) => (
        <MenuGroupSection key={group.id} group={group} />
      ))}
    </MenuTreeContext.Provider>
  );
}
