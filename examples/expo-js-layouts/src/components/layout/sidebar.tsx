import { Sidebar as BokoSidebar } from "bokoui/expo";
import type { ReactNode } from "react";
import { View } from "react-native";

export interface SidebarProps {
  /** Icon-only rail. */
  collapsed?: boolean;
  organizationSwitcher: ReactNode;
  /** Main menu groups. */
  navigation: ReactNode;
  commonMenu: ReactNode;
  account: ReactNode;
  labels: { navigation: string };
}

/**
 * Permanent sidebar of wide screens, built on the bokoui `Sidebar` (width, rail, scrolling): the organization
 * switcher on top, then the menu, the common menu and the account area.
 */
export function Sidebar({ collapsed = false, organizationSwitcher, navigation, commonMenu, account, labels }: SidebarProps) {
  return (
    <BokoSidebar collapsed={collapsed} label={labels.navigation} style={{ borderRightWidth: 0 }}>
      <View style={{ gap: 12 }}>
        {organizationSwitcher}
        {navigation}
        {commonMenu}
        {account}
      </View>
    </BokoSidebar>
  );
}
