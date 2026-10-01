import Link from "next/link";
import { Fragment } from "react";
import { Breadcrumb, BreadcrumbItem } from "bokoui/react";
import { findActiveTrail } from "@/lib/menu";
import type { MenuGroup, MenuItem } from "@/lib/types";

export interface MenuBreadcrumbsProps {
  /** Menu with labels already resolved (see `useMenu`). */
  groups: MenuGroup[];
  pathname: string;
  homeLabel: string;
  /** Accessible name of the landmark. */
  label: string;
  homeHref?: string;
}

/** Longer trails keep the first crumb and the last two; the middle becomes an ellipsis. */
const MAX_CRUMBS = 4;

/** Breadcrumbs from the menu's parent chain of the active item (FR-7.3). Renders nothing off-menu. */
export function MenuBreadcrumbs({ groups, pathname, homeLabel, label, homeHref = "/" }: MenuBreadcrumbsProps) {
  const trail = findActiveTrail(groups, pathname)?.items;
  // A single crumb would only repeat the page title in the header.
  if (!trail || trail.length < 2) return null;

  const current = trail[trail.length - 1];
  // A menu item that is the home page already is the first crumb.
  const startsAtHome = trail[0]?.href === homeHref;
  const parents: MenuItem[] = trail.slice(0, -1);
  const hidden = parents.length + (startsAtHome ? 0 : 1) + 1 > MAX_CRUMBS;
  const shownParents = hidden ? [parents[0], ...parents.slice(-1)].filter((item): item is MenuItem => Boolean(item)) : parents;

  return (
    <Breadcrumb aria-label={label} className="flex-nowrap overflow-hidden whitespace-nowrap text-nav">
      {startsAtHome ? null : (
        <BreadcrumbItem as={Link} href={homeHref} prefetch={false}>
          {homeLabel}
        </BreadcrumbItem>
      )}
      {shownParents.map((item, index) => (
        <Fragment key={item.id}>
          {hidden && index === 1 ? <BreadcrumbItem>…</BreadcrumbItem> : null}
          {item.href ? (
            <BreadcrumbItem as={Link} href={item.href} prefetch={false}>
              {item.label}
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem>{item.label}</BreadcrumbItem>
          )}
        </Fragment>
      ))}
      <BreadcrumbItem current>{current.label}</BreadcrumbItem>
    </Breadcrumb>
  );
}
