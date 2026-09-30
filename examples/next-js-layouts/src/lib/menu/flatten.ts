import type { MenuGroup, MenuItem } from "@/lib/types";

export interface FlatMenuEntry {
  item: MenuItem;
  group: MenuGroup;
  /** 0 for top-level items. */
  depth: number;
  /** Ids of the ancestors, outermost first. */
  parentIds: string[];
}

/** Depth-first list of every item, e.g. for search or counting. */
export function flattenMenu(groups: MenuGroup[]): FlatMenuEntry[] {
  const entries: FlatMenuEntry[] = [];
  const visit = (group: MenuGroup, items: MenuItem[], parentIds: string[]) => {
    for (const item of items) {
      entries.push({ item, group, depth: parentIds.length, parentIds });
      if (item.children) visit(group, item.children, [...parentIds, item.id]);
    }
  };
  for (const group of groups) visit(group, group.items, []);
  return entries;
}
