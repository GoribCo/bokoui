"use client";

import type { ReactNode } from "react";
import { sidebarClass } from "bokoui/core";

export interface SidebarLabels {
  /** Accessible name of the main navigation landmark. */
  navigation: string;
  /** Accessible name of the common links landmark. */
  commonNavigation: string;
}

/** Id of the sidebar element, target of the toggle button's `aria-controls`. */
export const SIDEBAR_ID = "app-sidebar";

export interface SidebarProps {
  /** Icon-only rail. Controlled by the caller so the state can live in a store; the header toggle changes it. */
  collapsed: boolean;
  /** Top section: organization switcher. */
  organizationSwitcher: ReactNode;
  /** Scrollable main navigation (a `MenuTree`). */
  navigation: ReactNode;
  /** Standard links below the navigation (terms, help, ...). */
  commonMenu: ReactNode;
  /** Bottom section: the signed-in user. */
  account: ReactNode;
  labels: SidebarLabels;
}

/**
 * Desktop sidebar in four sections, top to bottom: organization switcher, scrollable navigation,
 * common menu, account area. The width transition respects `prefers-reduced-motion` (FR-2.1, FR-2.3).
 */
export function Sidebar({
  collapsed,
  organizationSwitcher,
  navigation,
  commonMenu,
  account,
  labels,
}: SidebarProps) {
  return (
    <aside
      id={SIDEBAR_ID}
      data-tone="primary"
      data-collapsed={collapsed || undefined}
      className={sidebarClass("h-full gap-3 overflow-hidden")}
    >
      <div className="shrink-0">{organizationSwitcher}</div>

      {/* Only this area scrolls, so the switcher and the bottom sections stay in view. */}
      <nav
        aria-label={labels.navigation}
        className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1"
      >
        {navigation}
      </nav>

      <div className="flex shrink-0 flex-col gap-1 border-t border-border pt-2">
        <nav aria-label={labels.commonNavigation}>{commonMenu}</nav>
      </div>

      <div className="shrink-0 border-t border-border pt-2">{account}</div>
    </aside>
  );
}
