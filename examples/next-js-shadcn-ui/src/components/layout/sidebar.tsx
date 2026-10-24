"use client";

import type { ReactNode } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarSeparator } from "@/components/ui/sidebar";

export interface SidebarLabels {
  /** Accessible name of the main navigation landmark. */
  navigation: string;
  /** Accessible name of the common links landmark. */
  commonNavigation: string;
}

export interface AppSidebarProps {
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
 * Sidebar in four sections, top to bottom: organization switcher, scrollable navigation, common menu,
 * account area. It starts below the header (`--header-height`), collapses to an icon rail and becomes
 * a sheet on small screens; all of that comes from the shadcn `Sidebar` (FR-2.1, FR-2.3, FR-6.3).
 */
export function AppSidebar({ organizationSwitcher, navigation, commonMenu, account, labels }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarHeader>{organizationSwitcher}</SidebarHeader>
      <SidebarContent>
        <nav aria-label={labels.navigation}>{navigation}</nav>
      </SidebarContent>
      <SidebarFooter>
        <nav aria-label={labels.commonNavigation}>{commonMenu}</nav>
        <SidebarSeparator className="mx-0" />
        {account}
      </SidebarFooter>
    </Sidebar>
  );
}
