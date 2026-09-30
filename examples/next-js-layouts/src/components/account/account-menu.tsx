"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Menu, MenuItem, MenuLabel, MenuSeparator } from "bokoui/react/client";
import { MenuIcon } from "@/components/navigation/menu-icon";
import type { MenuItem as MenuEntry, User } from "@/lib/types";
import { UserAvatar } from "./user-avatar";

export interface AccountMenuProps {
  user: User;
  /** Links above Log out (manage account, view profile, ...), labels already resolved. */
  items: MenuEntry[];
  /** Injected by the host app: the shell does not implement authentication (FR-5.3). */
  onLogout: () => void | Promise<void>;
  /** Avatar only, same menu (FR-5.4). */
  collapsed?: boolean;
  labels: { menu: string; logout: string; signedInAs: string };
}

/** The signed-in user at the bottom of the sidebar, opening a menu of account entries. */
export function AccountMenu({ user, items, onLogout, collapsed = false, labels }: AccountMenuProps) {
  const router = useRouter();

  const trigger = (
    <button
      type="button"
      aria-label={collapsed ? `${labels.menu}: ${user.name}` : labels.menu}
      title={collapsed ? user.name : undefined}
      className={`flex w-full min-w-0 items-center gap-3 rounded-control p-2 text-start hover:bg-muted focus-ring pointer-coarse:min-h-11 ${
        collapsed ? "size-10 justify-center p-0" : ""
      }`}
    >
      <UserAvatar user={user} size="sm" />
      {collapsed ? null : (
        <>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-nav font-medium">{user.name}</span>
            <span className="truncate text-caption text-muted-foreground">{user.email}</span>
          </span>
          <ChevronsUpDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        </>
      )}
    </button>
  );

  return (
    <Menu trigger={trigger} placement={collapsed ? "right-end" : "top-start"} aria-label={labels.menu} className="w-64">
      <MenuLabel>
        <span className="block text-caption">{labels.signedInAs}</span>
        <span className="block truncate text-nav font-medium text-foreground">{user.name}</span>
        <span className="block truncate text-caption">{user.email}</span>
      </MenuLabel>
      <MenuSeparator />
      {items.map((item) => (
        <MenuItem key={item.id} onSelect={() => item.href && router.push(item.href)}>
          <span className="flex items-center gap-2 [&_svg]:size-4">
            <MenuIcon name={item.icon} />
            {item.label}
          </span>
        </MenuItem>
      ))}
      <MenuSeparator />
      <MenuItem danger onSelect={() => void onLogout()}>
        <span className="flex items-center gap-2 [&_svg]:size-4">
          <LogOut aria-hidden="true" />
          {labels.logout}
        </span>
      </MenuItem>
    </Menu>
  );
}
