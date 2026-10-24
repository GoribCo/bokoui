"use client";

import { MenuTree } from "@/components/navigation/menu-tree";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { MenuItem } from "@/lib/types";

export interface SubMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Sheet heading and accessible name: the parent item's label, or "More". */
  title: string;
  /** Items to list; they may nest further (groups inside the sheet collapse like in the sidebar). */
  items: MenuItem[];
  pathname: string;
}

/**
 * Bottom sheet above the bottom navigation, for an item with children and for the "More" overflow
 * (FR-6.2). A shadcn `Sheet`, so focus is trapped and Escape closes it.
 */
export function SubMenuSheet({ open, onOpenChange, title, items, pathname }: SubMenuSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        // Sits above the bar instead of covering it.
        className="bottom-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))] max-h-[calc(85dvh-var(--bottom-nav-height))] overflow-y-auto rounded-t-xl"
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className="sr-only">{title}</SheetDescription>
        </SheetHeader>
        {open ? (
          <div className="px-2 pb-4">
            <MenuTree groups={[{ id: "sheet", label: "", items }]} pathname={pathname} onNavigate={() => onOpenChange(false)} />
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
