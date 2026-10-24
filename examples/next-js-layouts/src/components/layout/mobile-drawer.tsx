"use client";

import { useEffect, type ReactNode } from "react";
import { Drawer } from "bokoui/react";

export interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible name of the drawer. */
  title: string;
  closeLabel: string;
  /** Closes the drawer whenever it changes, however the navigation was triggered. */
  pathname: string;
  organizationSwitcher: ReactNode;
  navigation: ReactNode;
  commonMenu: ReactNode;
  account: ReactNode;
}

/**
 * Full navigation for small screens, opened by the header hamburger: the same four sections as the
 * desktop sidebar. A native dialog, so focus is trapped and Escape closes it (FR-6.3, NFR-1).
 */
export function MobileDrawer({
  open,
  onOpenChange,
  title,
  closeLabel,
  pathname,
  organizationSwitcher,
  navigation,
  commonMenu,
  account,
}: MobileDrawerProps) {
  useEffect(() => {
    onOpenChange(false);
    // Only a path change should close it; `onOpenChange` is stable enough not to re-trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      side="left"
      size="sm"
      title={title}
      closeLabel={closeLabel}
    >
      {open ? (
        <div data-tone="primary" className="group/sidebar flex flex-col gap-4">
          {organizationSwitcher}
          <nav aria-label={title}>{navigation}</nav>
          <div className="border-t border-border pt-3">{commonMenu}</div>
          <div className="border-t border-border pt-3">{account}</div>
        </div>
      ) : null}
    </Drawer>
  );
}
