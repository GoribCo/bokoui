import { Text } from "bokoui/expo/ui";
import { useTheme } from "bokoui/expo";
import type { ReactNode } from "react";
import { View } from "react-native";

export interface HeaderProps {
  /** Far-left control: the hamburger on phones, the sidebar collapse toggle on wide screens. */
  leading?: ReactNode;
  /** Logo and product name; usually only on wide screens, where there is room. */
  branding?: ReactNode;
  /** Current screen title. */
  title: string;
  /** Small line under the title, e.g. the active organization. */
  subtitle?: string;
  search?: ReactNode;
  notifications?: ReactNode;
  /** Right-aligned controls, e.g. the display settings button. */
  actions?: ReactNode;
}

/** Top bar. Every slot is optional except the title, so a project can drop what it does not need. */
export function Header({ leading, branding, title, subtitle, search, notifications, actions }: HeaderProps) {
  const { tokens } = useTheme();
  return (
    <View accessibilityRole="header" style={{ minHeight: 56, flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8 }}>
      {leading}
      {branding}
      {branding ? <View style={{ width: tokens.borderWidth, height: 24, marginHorizontal: 8, backgroundColor: tokens.border }} /> : null}
      <View style={{ flex: 1, minWidth: 0, paddingHorizontal: 4 }}>
        <Text numberOfLines={1} style={{ fontWeight: "600" }}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" muted numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {search}
      {notifications}
      {actions}
    </View>
  );
}
