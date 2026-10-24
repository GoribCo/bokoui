"use client";

import { createContext, useContext } from "react";

export interface MenuTreeContextValue {
  /** Icon-only rail: labels hide, children are not rendered, tooltips show the names. */
  collapsed: boolean;
  activeItemId: string | null;
  expandedIds: ReadonlySet<string>;
  toggle: (itemId: string) => void;
  /** Called after a link is followed (the mobile sheet closes itself with it). */
  onNavigate?: () => void;
  /** Called when a parent without a link is chosen in the rail, so the sidebar can expand to show its children. */
  onRequestExpand?: () => void;
}

export const MenuTreeContext = createContext<MenuTreeContextValue | null>(null);

export function useMenuTree(): MenuTreeContextValue {
  const value = useContext(MenuTreeContext);
  if (!value) throw new Error("Menu components must be rendered inside <MenuTree>");
  return value;
}
