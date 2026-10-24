import { FloatingNav, FloatingNavItem } from "bokoui/expo/blocks";
import { Ellipsis } from "lucide-react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MenuIcon } from "@/components/navigation/menu-icon";
import { useNavigate } from "@/hooks/use-navigate";
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
   * `slots - 1` of them and the rest go into the "More" sheet.
   */
  slots: number;
  moreOpen: boolean;
  onMoreOpenChange: (open: boolean) => void;
  labels: BottomNavLabels;
}

/**
 * Phone navigation: the bokoui `FloatingNav` fed by the menu. Top-level items open sub menus in a sheet and
 * overflow goes into "More". It sits below the scroll area, so content is never covered.
 */
export function BottomNav({ groups, pathname, slots, moreOpen, onMoreOpenChange, labels }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const navigate = useNavigate();
  const [sheetItem, setSheetItem] = useState<MenuItem | null>(null);

  const items = groups.flatMap((group) => group.items);
  const overflow = items.length > slots;
  const visible = overflow ? items.slice(0, Math.max(slots - 1, 0)) : items;
  const hidden = overflow ? items.slice(visible.length) : [];

  const activeTopId = findActiveTrail(groups, pathname)?.items[0]?.id;
  // A parent that is also a link keeps its own page reachable as the first entry of its sheet.
  const sheetItems = sheetItem ? [...(sheetItem.href ? [{ ...sheetItem, children: undefined }] : []), ...(sheetItem.children ?? [])] : [];
  const moreActive = hidden.some((item) => item.id === activeTopId);

  return (
    <>
      <FloatingNav label={labels.navigation} bottomInset={insets.bottom}>
        {visible.map((item) => {
          const hasChildren = Boolean(item.children?.length);
          return (
            <FloatingNavItem
              key={item.id}
              label={item.label}
              icon={(color) => <MenuIcon name={item.icon} color={color} />}
              active={item.id === activeTopId}
              expanded={hasChildren ? sheetItem?.id === item.id : undefined}
              onPress={() => (hasChildren || !item.href ? setSheetItem(item) : navigate(item.href))}
            />
          );
        })}
        {overflow ? <FloatingNavItem label={labels.more} icon={(color) => <Ellipsis size={20} color={color} />} active={moreActive} expanded={moreOpen} onPress={() => onMoreOpenChange(true)} /> : null}
      </FloatingNav>

      <SubMenuSheet
        open={sheetItem !== null}
        onOpenChange={(open) => !open && setSheetItem(null)}
        title={sheetItem?.label ?? ""}
        items={sheetItems}
        pathname={pathname}
        closeLabel={labels.close}
      />
      <SubMenuSheet open={moreOpen} onOpenChange={onMoreOpenChange} title={labels.more} items={hidden} pathname={pathname} closeLabel={labels.close} />
    </>
  );
}
