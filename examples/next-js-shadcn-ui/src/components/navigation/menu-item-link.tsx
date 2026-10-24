"use client";

import Link from "next/link";
import { SidebarMenuBadge, SidebarMenuButton } from "@/components/ui/sidebar";
import { MenuIcon } from "./menu-icon";
import type { IconName } from "@/lib/types";

export interface MenuItemLinkProps {
  label: string;
  href: string;
  icon?: IconName;
  badge?: string | number;
  active?: boolean;
  /** Show a fallback icon when `icon` is missing (top-level items, so the rail stays readable). */
  showFallbackIcon?: boolean;
  onNavigate?: () => void;
}

/**
 * One link row. The label truncates with an ellipsis (its full text is the native title), and in the
 * collapsed rail the shadcn tooltip names the item.
 */
export function MenuItemLink({ label, href, icon, badge, active, showFallbackIcon, onNavigate }: MenuItemLinkProps) {
  return (
    <>
      <SidebarMenuButton asChild isActive={active} tooltip={label}>
        <Link href={href} prefetch={false} title={label} aria-current={active ? "page" : undefined} onClick={onNavigate}>
          {icon || showFallbackIcon ? <MenuIcon name={icon} /> : null}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
      {badge !== undefined ? <SidebarMenuBadge>{badge}</SidebarMenuBadge> : null}
    </>
  );
}
