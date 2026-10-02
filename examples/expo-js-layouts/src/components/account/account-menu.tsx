import { Button, Divider, Drawer, Text, useTheme } from "bokoui/expo";
import { ChevronsUpDown, LogOut } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { MenuIcon } from "@/components/navigation/menu-icon";
import { useNavigate } from "@/hooks/use-navigate";
import type { MenuItem, User } from "@/lib/types";
import { UserAvatar } from "./user-avatar";

export interface AccountMenuLabels {
  /** Accessible name of the trigger and the sheet. */
  menu: string;
  logout: string;
  close: string;
}

export interface AccountMenuProps {
  user: Pick<User, "name" | "email" | "avatarUrl">;
  /** Entries above "Sign out"; labels already resolved. */
  items: MenuItem[];
  /** Injected sign-out handler: the menu does not know how a session ends. */
  onLogout: () => void;
  /** Icon-only rail: the name and email hide. */
  collapsed?: boolean;
  /** Called after a link of the menu navigated, e.g. to close the drawer around it. */
  onNavigate?: () => void;
  labels: AccountMenuLabels;
}

/** Avatar with the user's name; opens a sheet with their details, links and "Sign out". */
export function AccountMenu({ user, items, onLogout, collapsed = false, onNavigate, labels }: AccountMenuProps) {
  const { tokens } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${labels.menu}: ${user.name}`}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          minHeight: 52,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 12,
          paddingHorizontal: 8,
          borderRadius: tokens.radiusControl,
          backgroundColor: pressed ? tokens.muted : "transparent",
        })}
      >
        <UserAvatar user={user} size="sm" />
        {collapsed ? null : (
          <>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={{ fontWeight: "500", fontSize: 14 }}>
                {user.name}
              </Text>
              <Text variant="caption" muted numberOfLines={1}>
                {user.email}
              </Text>
            </View>
            <ChevronsUpDown size={16} color={tokens.mutedFg} />
          </>
        )}
      </Pressable>

      <Drawer side="bottom" open={open} onOpenChange={setOpen} title={user.name} description={user.email} closeLabel={labels.close}>
        <View style={{ gap: 4 }}>
          {items.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="link"
              accessibilityLabel={item.label}
              onPress={() => {
                setOpen(false);
                onNavigate?.();
                if (item.href) navigate(item.href);
              }}
              style={({ pressed }) => ({
                minHeight: 48,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 8,
                borderRadius: tokens.radiusControl,
                backgroundColor: pressed ? tokens.muted : "transparent",
              })}
            >
              <MenuIcon name={item.icon} />
              <Text>{item.label}</Text>
            </Pressable>
          ))}
          <Divider style={{ marginVertical: 8 }} />
          <Button
            variant="outline"
            action="danger"
            fullWidth
            leftIcon={<LogOut size={16} color={tokens.danger} />}
            onPress={() => {
              setOpen(false);
              onNavigate?.();
              onLogout();
            }}
          >
            {labels.logout}
          </Button>
        </View>
      </Drawer>
    </>
  );
}
