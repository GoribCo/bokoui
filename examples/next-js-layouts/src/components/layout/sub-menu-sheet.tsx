"use client";

import { Drawer } from "bokoui/react/client";
import { MenuTree } from "@/components/navigation/menu-tree";
import type { MenuItem } from "@/types";

export interface SubMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Sheet heading and accessible name: the parent item's label, or "More". */
  title: string;
  /** Items to list; they may nest further (groups inside the sheet collapse like in the sidebar). */
  items: MenuItem[];
  pathname: string;
  closeLabel: string;
}

/**
 * Bottom sheet above the bottom navigation, for an item with children and for the "More" overflow
 * (FR-6.2). It is a native dialog, so focus is trapped and Escape closes it.
 */
export function SubMenuSheet({ open, onOpenChange, title, items, pathname, closeLabel }: SubMenuSheetProps) {
  return (
    <Drawer
      side="bottom"
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      closeLabel={closeLabel}
      // Sits above the bar instead of covering it.
      className="mb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))] max-h-[calc(85dvh-var(--bottom-nav-height))] rounded-t-card"
    >
      {open ? (
        <div data-tone="primary" className="group/sidebar">
          <MenuTree
            groups={[{ id: "sheet", label: "", items }]}
            pathname={pathname}
            onNavigate={() => onOpenChange(false)}
          />
        </div>
      ) : null}
    </Drawer>
  );
}
