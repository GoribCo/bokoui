"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useId, type ReactNode } from "react";
import { Button } from "bokoui/react";
import { Tooltip } from "bokoui/react/client";
import { sidebarClass } from "bokoui/core";

export interface SidebarLabels {
  /** Accessible name of the main navigation landmark. */
  navigation: string;
  /** Accessible name of the common links landmark. */
  commonNavigation: string;
  collapse: string;
  expand: string;
}

export interface SidebarProps {
  /** Icon-only rail. Controlled by the caller so the state can live in a store. */
  collapsed: boolean;
  onToggleCollapsed: () => void;
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
  onToggleCollapsed,
  organizationSwitcher,
  navigation,
  commonMenu,
  account,
  labels,
}: SidebarProps) {
  const id = useId();
  const toggleLabel = collapsed ? labels.expand : labels.collapse;
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      id={id}
      data-tone="primary"
      data-collapsed={collapsed || undefined}
      className={sidebarClass("h-full gap-3 overflow-hidden")}
    >
      <div className="shrink-0">{organizationSwitcher}</div>

      {/* Only this area scrolls, so the switcher and the bottom sections stay in view. */}
      <nav aria-label={labels.navigation} className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
        {navigation}
      </nav>

      <div className="flex shrink-0 flex-col gap-1 border-t border-border pt-2">
        <div className="flex group-data-[collapsed]/sidebar:justify-center">
          <Tooltip content={toggleLabel} placement="right">
            <Button
              variant="ghost"
              color="neutral"
              size="sm"
              iconOnly
              aria-label={toggleLabel}
              aria-expanded={!collapsed}
              aria-controls={id}
              onClick={onToggleCollapsed}
              className="ms-auto group-data-[collapsed]/sidebar:ms-0"
            >
              <ToggleIcon aria-hidden="true" />
            </Button>
          </Tooltip>
        </div>
        <nav aria-label={labels.commonNavigation}>{commonMenu}</nav>
      </div>

      <div className="shrink-0 border-t border-border pt-2">{account}</div>
    </aside>
  );
}
