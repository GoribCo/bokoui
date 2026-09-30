"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId } from "react";
import { SidebarSection } from "bokoui/react";
import { Tooltip } from "bokoui/react/client";
import { sidebarItemClass, sidebarItemLabelClass } from "bokoui/core";
import type { MenuGroup, MenuItem } from "@/types";
import { MenuIcon } from "./menu-icon";
import { MenuItemLink } from "./menu-item-link";
import { useMenuTree } from "./menu-tree-context";
import { useTruncatedLabel } from "./use-truncated-label";

const toggleClass =
  "group/toggle inline-flex size-8 shrink-0 items-center justify-center rounded-control text-muted-foreground " +
  "hover:bg-muted hover:text-foreground focus-ring pointer-coarse:size-11";
const chevronClass =
  "size-4 transition-transform duration-(--bokoui-duration) motion-reduce:transition-none group-aria-expanded/toggle:rotate-180";

function MenuBranch({ item, depth }: { item: MenuItem; depth: number }) {
  const { collapsed, activeItemId, expandedIds, toggle, onNavigate, onRequestExpand } = useMenuTree();
  const t = useTranslations("shell");
  const listId = useId();
  const { truncated, measure } = useTruncatedLabel();

  const children = item.children ?? [];
  const hasChildren = children.length > 0;
  const expanded = hasChildren && !collapsed && expandedIds.has(item.id);
  const active = item.id === activeItemId;
  const topLevel = depth === 0;

  // Children render only while expanded, so a menu of hundreds of items mounts just what is open.
  const childList = expanded ? (
    <ul id={listId} className="ms-3 flex flex-col gap-1 border-s border-border ps-1">
      {children.map((child) => (
        <MenuBranch key={child.id} item={child} depth={depth + 1} />
      ))}
    </ul>
  ) : null;

  if (!hasChildren) {
    return (
      <li>
        {item.href ? (
          <MenuItemLink
            label={item.label}
            href={item.href}
            icon={item.icon}
            badge={item.badge}
            active={active}
            collapsed={collapsed}
            showFallbackIcon={topLevel}
            onNavigate={onNavigate}
          />
        ) : null}
      </li>
    );
  }

  const toggleLabel = t(expanded ? "collapseGroup" : "expandGroup", { label: item.label });

  return (
    <li>
      {item.href ? (
        <div className="flex items-center gap-1">
          <MenuItemLink
            label={item.label}
            href={item.href}
            icon={item.icon}
            badge={item.badge}
            active={active}
            collapsed={collapsed}
            showFallbackIcon={topLevel}
            className="min-w-0 flex-1"
            onNavigate={onNavigate}
          />
          {collapsed ? null : (
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={expanded ? listId : undefined}
              aria-label={toggleLabel}
              className={toggleClass}
              onClick={() => toggle(item.id)}
            >
              <ChevronDown aria-hidden="true" className={chevronClass} />
            </button>
          )}
        </div>
      ) : (
        <Tooltip content={item.label} placement="right" disabled={!collapsed && !truncated}>
          <button
            type="button"
            aria-expanded={collapsed ? undefined : expanded}
            aria-controls={expanded ? listId : undefined}
            className={`group/toggle ${sidebarItemClass("text-start")}`}
            onMouseEnter={measure}
            onFocus={measure}
            onClick={() => {
              if (collapsed) onRequestExpand?.();
              toggle(item.id);
            }}
          >
            {item.icon || topLevel ? <MenuIcon name={item.icon} /> : null}
            <span data-menu-label className={sidebarItemLabelClass}>
              {item.label}
            </span>
            {collapsed ? null : <ChevronDown aria-hidden="true" className={chevronClass} />}
          </button>
        </Tooltip>
      )}
      {childList}
    </li>
  );
}

export interface MenuGroupSectionProps {
  group: MenuGroup;
}

/** A labeled section of the main navigation; its items may nest to any depth. */
export function MenuGroupSection({ group }: MenuGroupSectionProps) {
  return (
    <SidebarSection title={group.label}>
      <ul className="flex flex-col gap-1">
        {group.items.map((item) => (
          <MenuBranch key={item.id} item={item} depth={0} />
        ))}
      </ul>
    </SidebarSection>
  );
}
