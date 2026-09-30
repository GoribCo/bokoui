"use client";

import Link from "next/link";
import { Badge } from "bokoui/react";
import { Tooltip } from "bokoui/react/client";
import { sidebarItemClass, sidebarItemEndClass, sidebarItemLabelClass } from "bokoui/core";
import { MenuIcon } from "./menu-icon";
import { useTruncatedLabel } from "./use-truncated-label";
import type { IconName } from "@/types";

export interface MenuItemLinkProps {
  label: string;
  href: string;
  icon?: IconName;
  badge?: string | number;
  active?: boolean;
  /** Icon-only rail: the label moves into a tooltip. */
  collapsed?: boolean;
  /** Show a fallback icon when `icon` is missing (top-level items, so the rail stays readable). */
  showFallbackIcon?: boolean;
  className?: string;
  onNavigate?: () => void;
}

/**
 * One link row. A long label is truncated with an ellipsis and its full text appears in a tooltip,
 * which also names the item in the collapsed rail.
 */
export function MenuItemLink({
  label,
  href,
  icon,
  badge,
  active,
  collapsed,
  showFallbackIcon,
  className,
  onNavigate,
}: MenuItemLinkProps) {
  const { truncated, measure } = useTruncatedLabel();

  return (
    <Tooltip content={label} placement="right" disabled={!collapsed && !truncated}>
      <Link
        href={href}
        prefetch={false}
        aria-current={active ? "page" : undefined}
        className={sidebarItemClass(className)}
        onClick={onNavigate}
        onMouseEnter={measure}
        onFocus={measure}
      >
        {icon || showFallbackIcon ? <MenuIcon name={icon} /> : null}
        <span data-menu-label className={sidebarItemLabelClass}>
          {label}
        </span>
        {badge !== undefined ? (
          <span className={sidebarItemEndClass}>
            <Badge size="sm">{badge}</Badge>
          </span>
        ) : null}
      </Link>
    </Tooltip>
  );
}
