"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, type ReactNode } from "react";
import { Skeleton } from "bokoui/react";
import { AccountMenu } from "@/components/account/account-menu";
import { AppearanceMenu } from "@/components/appearance/appearance-menu";
import { CommonMenu } from "@/components/navigation/common-menu";
import { MenuBreadcrumbs } from "@/components/navigation/menu-breadcrumbs";
import { MenuTree } from "@/components/navigation/menu-tree";
import { OrganizationSwitcher } from "@/components/organization/organization-switcher";
import { useActiveOrganization } from "@/hooks/use-active-organization";
import { useMenu } from "@/hooks/use-menu";
import { useMenuTranslator } from "@/hooks/use-menu-translator";
import { useMenuQuery } from "@/hooks/use-queries";
import { localizeMenu } from "@/lib/menu";
import { useSession } from "@/providers/session-provider";
import { uiSelectors } from "@/lib/stores/ui-store";
import { useUiStore } from "@/providers/ui-store-provider";
import type { FooterLink, MenuGroup, MenuItem } from "@/lib/types";
import { AppShell } from "./app-shell";
import { BottomNav } from "./bottom-nav";
import { Branding } from "./branding";
import { Footer } from "./footer";
import { Header } from "./header";
import { HeaderSearch } from "./header-search";
import { MobileDrawer } from "./mobile-drawer";
import { MobileMenuButton } from "./mobile-menu-button";
import { NotificationsButton } from "./notifications-button";
import { Sidebar } from "./sidebar";

const NO_GROUPS: MenuGroup[] = [];

export interface DashboardShellProps {
  siteName: string;
  /** Standard links under the navigation; the same for every organization. */
  commonMenu: MenuItem[];
  accountMenuItems: MenuItem[];
  footerLinks: FooterLink[];
  /** Slots in the mobile bottom navigation (see `config/navigation.ts`). */
  bottomNavSlots: number;
  fontSwitcher?: boolean;
  /** Current year for the copyright line, passed from the server so both renders agree. */
  year: number;
  /** Injected sign-out handler (a Server Action in this demo). */
  onLogout: () => void | Promise<void>;
  children: ReactNode;
}

/**
 * Connects the session, stores, menu query and router to the presentational shell parts. All data
 * arrives through props and hooks; swapping the data source never touches the parts below.
 */
export function DashboardShell({
  siteName,
  commonMenu,
  accountMenuItems,
  footerLinks,
  bottomNavSlots,
  fontSwitcher = false,
  year,
  onLogout,
  children,
}: DashboardShellProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const { user } = useSession();
  const { organization, organizations, setActiveOrganization } = useActiveOrganization();
  const translate = useMenuTranslator();

  const menuQuery = useMenuQuery(organization.id);
  const menu = useMenu(menuQuery.data ?? NO_GROUPS);
  const common = useMemo(
    () => localizeMenu([{ id: "common", label: "", items: commonMenu }], translate)[0]?.items ?? [],
    [commonMenu, translate],
  );
  const accountItems = useMemo(
    () => localizeMenu([{ id: "account", label: "", items: accountMenuItems }], translate)[0]?.items ?? [],
    [accountMenuItems, translate],
  );
  const footer = useMemo(
    () => footerLinks.map((link) => ({ ...link, label: link.labelKey && translate.has(link.labelKey) ? translate(link.labelKey) : link.label })),
    [footerLinks, translate],
  );

  const collapsed = useUiStore(uiSelectors.sidebarCollapsed);
  const drawerOpen = useUiStore(uiSelectors.mobileDrawerOpen);
  const moreOpen = useUiStore(uiSelectors.bottomNavMoreOpen);
  const { setSidebarCollapsed, toggleSidebar, setMobileDrawerOpen, setBottomNavMoreOpen } = useUiStore(uiSelectors.actions);

  const switcherLabels = { switch: t("organization.switch"), search: t("organization.search"), noResults: t("organization.noResults") };
  const accountLabels = { menu: t("account.menu"), logout: t("account.logout"), signedInAs: t("account.signedInAs") };

  const switcher = (railCollapsed: boolean) => (
    <OrganizationSwitcher
      organizations={organizations}
      activeOrganizationId={organization.id}
      onSelect={setActiveOrganization}
      collapsed={railCollapsed}
      labels={switcherLabels}
    />
  );
  const navigation = (railCollapsed: boolean, onNavigate?: () => void) =>
    menuQuery.isPending ? (
      <div aria-busy="true" className="flex flex-col gap-2 p-1">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-full" />
        ))}
      </div>
    ) : (
      <MenuTree
        // A new organization means a new menu: start with fresh expansion state.
        key={organization.id}
        groups={menu}
        pathname={pathname}
        collapsed={railCollapsed}
        onNavigate={onNavigate}
        onRequestExpand={() => setSidebarCollapsed(false)}
      />
    );
  const commonLinks = (railCollapsed: boolean, onNavigate?: () => void) => (
    <CommonMenu items={common} pathname={pathname} collapsed={railCollapsed} onNavigate={onNavigate} />
  );
  const account = (railCollapsed: boolean) => (
    <AccountMenu user={user} items={accountItems} onLogout={onLogout} collapsed={railCollapsed} labels={accountLabels} />
  );
  const closeDrawer = () => setMobileDrawerOpen(false);

  return (
    <AppShell
      skipToContentLabel={t("shell.skipToContent")}
      sidebar={
        <Sidebar
          collapsed={collapsed}
          onToggleCollapsed={toggleSidebar}
          organizationSwitcher={switcher(collapsed)}
          navigation={navigation(collapsed)}
          commonMenu={commonLinks(collapsed)}
          account={account(collapsed)}
          labels={{
            navigation: t("shell.mainNavigation"),
            commonNavigation: t("shell.commonNavigation"),
            collapse: t("shell.collapseSidebar"),
            expand: t("shell.expandSidebar"),
          }}
        />
      }
      header={
        <Header
          menuButton={<MobileMenuButton label={t("shell.openMenu")} expanded={drawerOpen} onClick={() => setMobileDrawerOpen(true)} />}
          branding={<Branding name={siteName} />}
          breadcrumbs={<MenuBreadcrumbs groups={menu} pathname={pathname} homeLabel={t("shell.home")} label={t("shell.breadcrumb")} />}
          search={<HeaderSearch label={t("shell.search")} placeholder={t("shell.searchPlaceholder")} />}
          notifications={<NotificationsButton label={t("shell.notifications")} />}
          actions={<AppearanceMenu fontSwitcher={fontSwitcher} />}
        />
      }
      footer={<Footer links={footer} copyright={t("footer.copyright", { year, name: siteName })} navigationLabel={t("footer.navigation")} />}
      overlays={
        <MobileDrawer
          open={drawerOpen}
          onOpenChange={setMobileDrawerOpen}
          title={t("shell.mainNavigation")}
          closeLabel={t("shell.close")}
          pathname={pathname}
          organizationSwitcher={switcher(false)}
          navigation={navigation(false, closeDrawer)}
          commonMenu={commonLinks(false, closeDrawer)}
          account={account(false)}
        />
      }
      bottomNav={
        <BottomNav
          groups={menu}
          pathname={pathname}
          slots={bottomNavSlots}
          moreOpen={moreOpen}
          onMoreOpenChange={setBottomNavMoreOpen}
          labels={{ navigation: t("shell.mobileNavigation"), more: t("shell.more"), close: t("shell.close") }}
        />
      }
    >
      {children}
    </AppShell>
  );
}
