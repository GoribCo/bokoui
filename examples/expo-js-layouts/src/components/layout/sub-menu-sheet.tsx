import { Drawer } from "bokoui/expo/blocks";
import { ScrollView } from "react-native";
import { MenuTree } from "@/components/navigation/menu-tree";
import { useSheetHeight } from "@/hooks/use-sheet-height";
import type { MenuItem } from "@/lib/types";

export interface SubMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Sheet heading and accessible name: the parent item's label, or "More". */
  title: string;
  /** Items to list; one nested level opens as an accordion inside the sheet. */
  items: MenuItem[];
  pathname: string;
  closeLabel: string;
}

/** Bottom sheet for a bottom-bar item with children and for the "More" overflow. */
export function SubMenuSheet({ open, onOpenChange, title, items, pathname, closeLabel }: SubMenuSheetProps) {
  const maxHeight = useSheetHeight();
  return (
    <Drawer side="bottom" open={open} onOpenChange={onOpenChange} title={title} closeLabel={closeLabel}>
      {open ? (
        <ScrollView style={{ maxHeight }} keyboardShouldPersistTaps="handled">
          <MenuTree groups={[{ id: "sheet", label: "", items }]} pathname={pathname} onNavigate={() => onOpenChange(false)} />
        </ScrollView>
      ) : null}
    </Drawer>
  );
}
