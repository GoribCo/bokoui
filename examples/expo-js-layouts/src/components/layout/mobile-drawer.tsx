import { Divider, Drawer, Text, useTheme } from "bokoui/expo";
import { X } from "lucide-react-native";
import type { ReactNode } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "./icon-button";

export interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Heading and accessible name of the drawer. */
  title: string;
  closeLabel: string;
  /** Organization and role switchers. */
  organizationSwitcher: ReactNode;
  /** Main menu groups; they scroll. */
  navigation: ReactNode;
  commonMenu: ReactNode;
  /** Account area, pinned to the bottom. */
  account: ReactNode;
}

/** Room the bokoui drawer card keeps for its own padding, and for the title row and the pinned account area. */
const CARD_PADDING = 40;
const TITLE_HEIGHT = 52;
const ACCOUNT_HEIGHT = 76;

/**
 * Full navigation for phones, opened from the header's hamburger. The bokoui drawer covers the whole
 * height (under the status bar), so the title row pads for the safe area itself; its body sizes to its
 * content, so the scrolling part gets an explicit height and the account area stays at the bottom.
 */
export function MobileDrawer({ open, onOpenChange, title, closeLabel, organizationSwitcher, navigation, commonMenu, account }: MobileDrawerProps) {
  const { tokens } = useTheme();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollHeight = Math.max(200, height - insets.top - insets.bottom - CARD_PADDING - TITLE_HEIGHT - ACCOUNT_HEIGHT);
  return (
    <Drawer side="left" open={open} onOpenChange={onOpenChange} showClose={false}>
      {open ? (
        <View accessibilityLabel={title} style={{ marginTop: -8, paddingTop: insets.top, paddingBottom: insets.bottom }}>
          <View style={{ height: TITLE_HEIGHT, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text accessibilityRole="header" style={{ fontWeight: "600", fontSize: 18, color: tokens.fg }}>
              {title}
            </Text>
            <IconButton label={closeLabel} icon={<X size={20} color={tokens.fg} />} onPress={() => onOpenChange(false)} />
          </View>
          <ScrollView style={{ height: scrollHeight }} contentContainerStyle={{ gap: 12 }} keyboardShouldPersistTaps="handled">
            {organizationSwitcher}
            <Divider />
            {navigation}
            <Divider />
            {commonMenu}
          </ScrollView>
          <Divider style={{ marginVertical: 8 }} />
          {account}
        </View>
      ) : null}
    </Drawer>
  );
}
