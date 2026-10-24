import { useMemo } from "react";
import type { MenuItem } from "@/lib/types";
import { MenuTree } from "./menu-tree";

export interface CommonMenuProps {
  /** Standard items (help, terms, ...), labels already resolved. They are the same in every organization. */
  items: MenuItem[];
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
  /** Group heading, e.g. "Resources". */
  heading?: string;
}

/** The menu every organization shares, below the organization's own groups. */
export function CommonMenu({ items, pathname, collapsed = false, onNavigate, heading = "" }: CommonMenuProps) {
  const groups = useMemo(() => [{ id: "common", label: heading, items }], [items, heading]);
  if (items.length === 0) return null;
  return <MenuTree groups={groups} pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} />;
}
