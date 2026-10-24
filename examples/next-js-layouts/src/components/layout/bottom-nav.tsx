"use client";

import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FloatingNav, FloatingNavItem } from "bokoui/react";
import { MenuIcon } from "@/components/navigation/menu-icon";
import { findActiveTrail } from "@/lib/menu";
import type { MenuGroup, MenuItem } from "@/lib/types";
import { SubMenuSheet } from "./sub-menu-sheet";

export interface BottomNavLabels {
  navigation: string;
  more: string;
  close: string;
}

export interface BottomNavProps {
  /** Menu with labels resolved; the top-level items of all groups become the bar's entries. */
  groups: MenuGroup[];
  pathname: string;
  /**
   * Number of slots in the bar, counting "More". Fewer items fill fewer slots; more items show
   * `slots - 1` of them and the rest go into the "More" sheet (FR-6.7).
   */
  slots: number;
  moreOpen: boolean;
  onMoreOpenChange: (open: boolean) => void;
  labels: BottomNavLabels;
}

/**
 * Mobile navigation bar (below `md`): top-level items, sub menus in a sheet above the bar, overflow
 * in "More". Respects the device safe area (FR-6.1, FR-6.2, FR-6.5, FR-6.7).
 */
export function BottomNav({
  groups,
  pathname,
  slots,
  moreOpen,
  onMoreOpenChange,
  labels,
}: BottomNavProps) {
  const [sheetItem, setSheetItem] = useState<MenuItem | null>(null);

  const items = groups.flatMap((group) => group.items);
  const overflow = items.length > slots;
  const visible = overflow ? items.slice(0, Math.max(slots - 1, 0)) : items;
  const hidden = overflow ? items.slice(visible.length) : [];

  const activeTopId = findActiveTrail(groups, pathname)?.items[0]?.id;
  // A parent that is also a link keeps its own page reachable as the first entry of its sheet.
  const sheetItems = sheetItem
    ? [
        ...(sheetItem.href ? [{ ...sheetItem, children: undefined }] : []),
        ...(sheetItem.children ?? []),
      ]
    : [];
  const moreActive = hidden.some((item) => item.id === activeTopId);

  return (
    <>
      <FloatingNav aria-label={labels.navigation} data-tone="primary">
        {visible.map((item) => {
          const active = item.id === activeTopId;
          const hasChildren = Boolean(item.children?.length);
          return hasChildren || !item.href ? (
            <FloatingNavItem
              key={item.id}
              as="button"
              type="button"
              active={active}
              aria-label={item.label}
              aria-haspopup="dialog"
              aria-expanded={sheetItem?.id === item.id}
              onClick={() => setSheetItem(item)}
            >
              <MenuIcon name={item.icon} />
            </FloatingNavItem>
          ) : (
            <FloatingNavItem key={item.id} as={Link} href={item.href} prefetch={false} active={active} aria-label={item.label}>
              <MenuIcon name={item.icon} />
            </FloatingNavItem>
          );
        })}
        {overflow ? (
          <FloatingNavItem
            as="button"
            type="button"
            active={moreActive}
            aria-label={labels.more}
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            onClick={() => onMoreOpenChange(true)}
          >
            <Ellipsis aria-hidden="true" />
          </FloatingNavItem>
        ) : null}
      </FloatingNav>

      <SubMenuSheet
        open={sheetItem !== null}
        onOpenChange={(open) => !open && setSheetItem(null)}
        title={sheetItem?.label ?? ""}
        items={sheetItems}
        pathname={pathname}
        closeLabel={labels.close}
      />
      <SubMenuSheet
        open={moreOpen}
        onOpenChange={onMoreOpenChange}
        title={labels.more}
        items={hidden}
        pathname={pathname}
        closeLabel={labels.close}
      />
    </>
  );
}
