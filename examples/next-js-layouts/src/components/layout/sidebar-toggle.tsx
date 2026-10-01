"use client";

import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "bokoui/react";
import { Tooltip } from "bokoui/react/client";
import { SIDEBAR_ID } from "./sidebar";

export interface SidebarToggleProps {
  /** Desktop rail state. */
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** Mobile drawer state. */
  drawerOpen: boolean;
  onOpenDrawer: () => void;
  labels: { collapse: string; expand: string; openMenu: string };
}

/**
 * The button at the left of the header. From `md` up it collapses or expands the sidebar rail; below
 * that there is no sidebar, so it opens the navigation drawer instead (FR-2.3, FR-6.3).
 */
export function SidebarToggle({ collapsed, onToggleCollapsed, drawerOpen, onOpenDrawer, labels }: SidebarToggleProps) {
  const label = collapsed ? labels.expand : labels.collapse;
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <>
      <div className="hidden md:block">
        <Tooltip content={label} placement="bottom">
          <Button
            variant="ghost"
            color="neutral"
            iconOnly
            aria-label={label}
            aria-expanded={!collapsed}
            aria-controls={SIDEBAR_ID}
            onClick={onToggleCollapsed}
          >
            <Icon aria-hidden="true" />
          </Button>
        </Tooltip>
      </div>
      <div className="md:hidden">
        <Button
          variant="ghost"
          color="neutral"
          iconOnly
          aria-label={labels.openMenu}
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
          onClick={onOpenDrawer}
        >
          <Menu aria-hidden="true" />
        </Button>
      </div>
    </>
  );
}
