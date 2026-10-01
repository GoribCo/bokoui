"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { MenuIcon } from "@/components/navigation/menu-icon";
import type { MenuItem as MenuEntry, User } from "@/lib/types";
import { UserAvatar } from "./user-avatar";

export interface AccountMenuProps {
  user: User;
  /** Links above Sign out (settings, profile, ...), labels already resolved. */
  items: MenuEntry[];
  /** Injected by the host app: the shell does not implement authentication (FR-5.3). */
  onLogout: () => void | Promise<void>;
  labels: { menu: string; logout: string };
}

/** The signed-in user at the bottom of the sidebar, opening a menu of account entries (FR-5.1 to FR-5.4). */
export function AccountMenu({ user, items, onLogout, labels }: AccountMenuProps) {
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={user.name}
              aria-label={labels.menu}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar user={user} size="sm" />
              <div className="grid min-w-0 flex-1 text-start text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDown aria-hidden="true" className="ms-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side={isMobile ? "top" : "right"}
            sideOffset={4}
            aria-label={labels.menu}
            className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-lg"
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                <UserAvatar user={user} size="sm" />
                <div className="grid min-w-0 flex-1 leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {items.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onSelect={() => {
                  setOpenMobile(false);
                  if (item.href) router.push(item.href);
                }}
              >
                <MenuIcon name={item.icon} />
                {item.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => void onLogout()}>
              <LogOut aria-hidden="true" />
              {labels.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
