"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { MenuGroup, MenuItem } from "@/lib/types";
import { MenuIcon } from "./menu-icon";
import { MenuItemLink } from "./menu-item-link";
import { useMenuTree } from "./menu-tree-context";

const chevronClass = "transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90";

/** A nested row (depth 1 and deeper): a link, or a parent with its own collapsible list. */
function SubBranch({ item }: { item: MenuItem }) {
  const { activeItemId, expandedIds, toggle, onNavigate } = useMenuTree();
  const children = item.children ?? [];
  const active = item.id === activeItemId;

  if (children.length === 0) {
    return item.href ? (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={active}>
          <Link href={item.href} prefetch={false} title={item.label} aria-current={active ? "page" : undefined} onClick={onNavigate}>
            {item.icon ? <MenuIcon name={item.icon} /> : null}
            <span>{item.label}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    ) : null;
  }

  return (
    <Collapsible asChild open={expandedIds.has(item.id)} onOpenChange={() => toggle(item.id)} className="group/collapsible">
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton asChild>
            <button type="button" title={item.label} className="w-full">
              {item.icon ? <MenuIcon name={item.icon} /> : null}
              <span>{item.label}</span>
              <ChevronRight aria-hidden="true" className={`ms-auto ${chevronClass}`} />
            </button>
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {children.map((child) => (
              <SubBranch key={child.id} item={child} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  );
}

/** A top-level row: a link, or a parent whose children open in a collapsible list. */
function TopBranch({ item }: { item: MenuItem }) {
  const { collapsed, activeItemId, expandedIds, toggle, onNavigate, onRequestExpand } = useMenuTree();
  const t = useTranslations("shell");
  const children = item.children ?? [];
  const active = item.id === activeItemId;

  if (children.length === 0) {
    return item.href ? (
      <SidebarMenuItem>
        <MenuItemLink
          label={item.label}
          href={item.href}
          icon={item.icon}
          badge={item.badge}
          active={active}
          showFallbackIcon
          onNavigate={onNavigate}
        />
      </SidebarMenuItem>
    ) : null;
  }

  const expanded = !collapsed && expandedIds.has(item.id);
  const toggleLabel = t(expanded ? "collapseGroup" : "expandGroup", { label: item.label });

  return (
    <Collapsible asChild open={expanded} onOpenChange={() => toggle(item.id)} className="group/collapsible">
      <SidebarMenuItem>
        {item.href ? (
          <>
            <MenuItemLink
              label={item.label}
              href={item.href}
              icon={item.icon}
              badge={item.badge}
              active={active}
              showFallbackIcon
              onNavigate={onNavigate}
            />
            {collapsed ? null : (
              <CollapsibleTrigger asChild>
                <SidebarMenuAction aria-label={toggleLabel}>
                  <ChevronRight aria-hidden="true" className={chevronClass} />
                </SidebarMenuAction>
              </CollapsibleTrigger>
            )}
          </>
        ) : (
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.label}
              title={item.label}
              onClick={(event) => {
                // In the rail the children have no room: expand the sidebar and open the group.
                if (collapsed) {
                  event.preventDefault();
                  onRequestExpand?.();
                  if (!expandedIds.has(item.id)) toggle(item.id);
                }
              }}
            >
              <MenuIcon name={item.icon} />
              <span>{item.label}</span>
              <ChevronRight aria-hidden="true" className={`ms-auto ${chevronClass}`} />
            </SidebarMenuButton>
          </CollapsibleTrigger>
        )}
        {/* Children render only while expanded, so a menu of hundreds of items mounts just what is open. */}
        {expanded ? (
          <CollapsibleContent>
            <SidebarMenuSub>
              {children.map((child) => (
                <SubBranch key={child.id} item={child} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        ) : null}
      </SidebarMenuItem>
    </Collapsible>
  );
}

export interface MenuGroupSectionProps {
  group: MenuGroup;
}

/** A labeled section of the main navigation; its items may nest to any depth. */
export function MenuGroupSection({ group }: MenuGroupSectionProps) {
  return (
    <SidebarGroup>
      {group.label ? <SidebarGroupLabel>{group.label}</SidebarGroupLabel> : null}
      <SidebarMenu>
        {group.items.map((item) => (
          <TopBranch key={item.id} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
