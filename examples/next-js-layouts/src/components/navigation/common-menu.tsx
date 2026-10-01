"use client";

import { isPathActive } from "@/lib/menu";
import type { MenuItem } from "@/lib/types";
import { MenuItemLink } from "./menu-item-link";

export interface CommonMenuProps {
  /** Standard links (terms, help, privacy settings, ...), labels already resolved; same for every organization. */
  items: MenuItem[];
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
  /** Small group heading above the links ("Resources"); hidden on the collapsed rail. */
  heading?: string;
}

/** The menu under the main navigation; it comes from `config`, not from the active organization (FR-4.5). */
export function CommonMenu({ items, pathname, collapsed = false, onNavigate, heading }: CommonMenuProps) {
  return (
    <>
      {heading && !collapsed ? <p className="px-2 pb-1 text-caption text-muted-foreground">{heading}</p> : null}
      <ul className="flex flex-col gap-1">
      {items.map((item) =>
        item.href ? (
          <li key={item.id}>
            <MenuItemLink
              label={item.label}
              href={item.href}
              icon={item.icon}
              badge={item.badge}
              active={isPathActive(item.href, pathname)}
              collapsed={collapsed}
              showFallbackIcon
              onNavigate={onNavigate}
            />
          </li>
        ) : null,
      )}
    </ul>
    </>
  );
}
