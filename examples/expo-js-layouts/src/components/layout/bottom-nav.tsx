import { Text, useTheme } from "bokoui/expo";
import { Ellipsis } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MenuIcon } from "@/components/navigation/menu-icon";
import { useNavigate } from "@/hooks/use-navigate";
import { usePrimaryTone } from "@/hooks/use-primary-tone";
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

interface EntryProps {
  label: string;
  icon: (color: string) => React.ReactNode;
  active: boolean;
  expanded?: boolean;
  onPress: () => void;
}

function Entry({ label, icon, active, expanded, onPress }: EntryProps) {
  const { tokens } = useTheme();
  const tone = usePrimaryTone();
  const color = active ? tone.ink : tokens.mutedFg;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active, expanded }}
      onPress={onPress}
      style={{ flex: 1, minWidth: 0, minHeight: 56, alignItems: "center", justifyContent: "center", gap: 2, paddingHorizontal: 4 }}
    >
      {icon(color)}
      <Text variant="caption" numberOfLines={1} style={{ color, fontWeight: active ? "600" : "400", maxWidth: "100%" }}>
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Phone navigation bar: top-level items, sub menus in a bottom sheet, overflow in "More". It sits below the
 * scroll area and pads for the device's safe area.
 */
export function BottomNav({ groups, pathname, slots, moreOpen, onMoreOpenChange, labels }: BottomNavProps) {
  const { tokens } = useTheme();
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
      <View
        accessibilityRole="tablist"
        accessibilityLabel={labels.navigation}
        style={{
          flexDirection: "row",
          paddingBottom: insets.bottom,
          backgroundColor: tokens.surface,
          borderTopWidth: tokens.borderWidth,
          borderColor: tokens.border,
        }}
      >
        {visible.map((item) => {
          const hasChildren = Boolean(item.children?.length);
          return (
            <Entry
              key={item.id}
              label={item.label}
              icon={(color) => <MenuIcon name={item.icon} color={color} />}
              active={item.id === activeTopId}
              expanded={hasChildren ? sheetItem?.id === item.id : undefined}
              onPress={() => (hasChildren || !item.href ? setSheetItem(item) : navigate(item.href))}
            />
          );
        })}
        {overflow ? (
          <Entry
            label={labels.more}
            icon={(color) => <Ellipsis size={20} color={color} />}
            active={moreActive}
            expanded={moreOpen}
            onPress={() => onMoreOpenChange(true)}
          />
        ) : null}
      </View>

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
