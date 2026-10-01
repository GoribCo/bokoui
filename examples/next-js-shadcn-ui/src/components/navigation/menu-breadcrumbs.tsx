import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DASHBOARD_PATH } from "@/lib/config/auth";
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
export function MenuBreadcrumbs({ groups, pathname, homeLabel, label, homeHref = DASHBOARD_PATH }: MenuBreadcrumbsProps) {
  const trail = findActiveTrail(groups, pathname)?.items;
  // A single crumb would only repeat the page title in the header.
  if (!trail || trail.length < 2) return null;

  const current = trail[trail.length - 1];
  // A menu item that is the home page already is the first crumb.
  const startsAtHome = trail[0]?.href === homeHref;
  const parents: MenuItem[] = trail.slice(0, -1);
  const hidden = parents.length + (startsAtHome ? 0 : 1) + 1 > MAX_CRUMBS;
  const shownParents = hidden ? [parents[0], ...parents.slice(-1)].filter((item): item is MenuItem => Boolean(item)) : parents;

  const crumbs = [
    ...(startsAtHome ? [] : [{ id: "home", label: homeLabel, href: homeHref }]),
    ...shownParents.map((item) => ({ id: item.id, label: item.label, href: item.href })),
  ];

  return (
    <Breadcrumb aria-label={label}>
      <BreadcrumbList className="flex-nowrap overflow-hidden whitespace-nowrap text-nav">
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.id}>
            {hidden && index === crumbs.length - 1 && crumbs.length > 1 ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbEllipsis className="size-4" />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : null}
            <BreadcrumbItem>
              {crumb.href ? (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href} prefetch={false}>
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                crumb.label
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{current.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
