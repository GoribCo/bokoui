"use client";

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { isPathActive } from "@/lib/menu";
import type { MenuItem } from "@/lib/types";
import { MenuItemLink } from "./menu-item-link";

export interface CommonMenuProps {
  /** Standard links (terms, help, privacy settings, ...), labels already resolved; same for every organization. */
  items: MenuItem[];
  pathname: string;
  /** Small group heading above the links ("Resources"); hidden on the collapsed rail. */
  heading?: string;
}

/** The menu under the main navigation; it comes from `config`, not from the active organization (FR-4.5). */
export function CommonMenu({ items, pathname, heading }: CommonMenuProps) {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarGroup className="p-0">
      {heading ? <SidebarGroupLabel>{heading}</SidebarGroupLabel> : null}
      <SidebarMenu>
        {items.map((item) =>
          item.href ? (
            <SidebarMenuItem key={item.id}>
              <MenuItemLink
                label={item.label}
                href={item.href}
                icon={item.icon}
                badge={item.badge}
                active={isPathActive(item.href, pathname)}
                showFallbackIcon
                onNavigate={() => setOpenMobile(false)}
              />
            </SidebarMenuItem>
          ) : null,
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
