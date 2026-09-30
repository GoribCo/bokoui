"use client";

import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

const entryClass =
  "flex h-full w-full min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-caption text-muted-foreground " +
  "focus-ring hover:text-foreground aria-[current=page]:font-medium aria-[current=page]:text-primary " +
  "data-[active]:font-medium data-[active]:text-primary [&_svg]:size-5";

/**
 * Mobile navigation bar (below `md`): top-level items, sub menus in a sheet above the bar, overflow
 * in "More". Respects the device safe area (FR-6.1, FR-6.2, FR-6.5, FR-6.7).
 */
export function BottomNav({ groups, pathname, slots, moreOpen, onMoreOpenChange, labels }: BottomNavProps) {
  const [sheetItem, setSheetItem] = useState<MenuItem | null>(null);

  const items = groups.flatMap((group) => group.items);
  const overflow = items.length > slots;
  const visible = overflow ? items.slice(0, Math.max(slots - 1, 0)) : items;
  const hidden = overflow ? items.slice(visible.length) : [];

  const activeTopId = findActiveTrail(groups, pathname)?.items[0]?.id;
  // A parent that is also a link keeps its own page reachable as the first entry of its sheet.
  const sheetItems = sheetItem
    ? [...(sheetItem.href ? [{ ...sheetItem, children: undefined }] : []), ...(sheetItem.children ?? [])]
    : [];
  const moreActive = hidden.some((item) => item.id === activeTopId);

  return (
    <>
      <nav
        aria-label={labels.navigation}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]"
        data-tone="primary"
      >
        <ul className="grid h-(--bottom-nav-height) grid-flow-col auto-cols-fr">
          {visible.map((item) => {
            const active = item.id === activeTopId;
            const hasChildren = Boolean(item.children?.length);
            return (
              <li key={item.id} className="min-w-0">
                {hasChildren || !item.href ? (
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded={sheetItem?.id === item.id}
                    data-active={active || undefined}
                    className={entryClass}
                    onClick={() => setSheetItem(item)}
                  >
                    <MenuIcon name={item.icon} />
                    <span className="max-w-full truncate">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    prefetch={false}
                    aria-current={active ? "page" : undefined}
                    className={entryClass}
                  >
                    <MenuIcon name={item.icon} />
                    <span className="max-w-full truncate">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
          {overflow ? (
            <li className="min-w-0">
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={moreOpen}
                data-active={moreActive || undefined}
                className={entryClass}
                onClick={() => onMoreOpenChange(true)}
              >
                <Ellipsis aria-hidden="true" />
                <span className="max-w-full truncate">{labels.more}</span>
              </button>
            </li>
          ) : null}
        </ul>
      </nav>

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
