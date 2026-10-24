"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, type CSSProperties, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AccountMenu } from "@/components/account/account-menu";
import { DisplaySettingsMenu } from "@/components/appearance/display-settings-menu";
import { CommonMenu } from "@/components/navigation/common-menu";
import { MenuBreadcrumbs } from "@/components/navigation/menu-breadcrumbs";
import { MenuTree } from "@/components/navigation/menu-tree";
import { OrganizationSwitcher } from "@/components/organization/organization-switcher";
import { useActiveOrganization } from "@/hooks/use-active-organization";
import { useMenu } from "@/hooks/use-menu";
import { useMenuTranslator } from "@/hooks/use-menu-translator";
import { useMenuQuery } from "@/hooks/use-queries";
import { sampleNotifications } from "@/lib/sample-data";
import { DASHBOARD_PATH } from "@/lib/config/auth";
import { findActiveTrail, localizeMenu } from "@/lib/menu";
import { useSession } from "@/providers/session-provider";
import { uiSelectors } from "@/lib/stores/ui-store";
import { useUiStore } from "@/providers/ui-store-provider";
import type { FooterLink, MenuGroup, MenuItem } from "@/lib/types";
import { BottomNav } from "./bottom-nav";
import { Branding } from "./branding";
import { Footer } from "./footer";
import { Header } from "./header";
import { HeaderSearch } from "./header-search";
import { NotificationsButton } from "./notifications-button";
import { AppSidebar } from "./sidebar";
import { SidebarToggle } from "./sidebar-toggle";

const NO_GROUPS: MenuGroup[] = [];

/** Id of the main content, target of the skip link. */
export const MAIN_CONTENT_ID = "main-content";

export interface DashboardShellProps {
  siteName: string;
  /** Standard links under the navigation; the same for every organization. */
  commonMenu: MenuItem[];
  accountMenuItems: MenuItem[];
  footerLinks: FooterLink[];
  /** Slots in the mobile bottom navigation (see `config/navigation.ts`). */
  bottomNavSlots: number;
  /** Target of "Manage workspaces"; the link is hidden when unset. */
  manageOrganizationsHref?: string;
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
  manageOrganizationsHref,
  year,
  onLogout,
  children,
}: DashboardShellProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const { user } = useSession();
  const { organization, organizations, setActiveOrganization } =
    useActiveOrganization();
  const translate = useMenuTranslator();

  const menuQuery = useMenuQuery(organization.id);
  const menu = useMenu(menuQuery.data ?? NO_GROUPS);
  const common = useMemo(
    () =>
      localizeMenu(
        [{ id: "common", label: "", items: commonMenu }],
        translate,
      )[0]?.items ?? [],
    [commonMenu, translate],
  );
  const accountItems = useMemo(
    () =>
      localizeMenu(
        [{ id: "account", label: "", items: accountMenuItems }],
        translate,
      )[0]?.items ?? [],
    [accountMenuItems, translate],
  );
  const footer = useMemo(
    () =>
      footerLinks.map((link) => ({
        ...link,
        label:
          link.labelKey && translate.has(link.labelKey)
            ? translate(link.labelKey)
            : link.label,
      })),
    [footerLinks, translate],
  );

  const collapsed = useUiStore(uiSelectors.sidebarCollapsed);
  const moreOpen = useUiStore(uiSelectors.bottomNavMoreOpen);
  const { setSidebarCollapsed, setBottomNavMoreOpen } = useUiStore(uiSelectors.actions);

  const pageTitle = findActiveTrail(menu, pathname)?.items.at(-1)?.label ?? t("shell.pageTitleFallback");

  return (
    // The provider owns the sidebar state (collapsed rail on desktop, sheet on mobile); the collapsed
    // flag lives in our store so it survives reloads without a flash.
    <SidebarProvider
      open={!collapsed}
      onOpenChange={(open) => setSidebarCollapsed(!open)}
      className="flex-col"
      style={{ "--header-height": "3.5rem" } as CSSProperties}
    >
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only z-50 rounded-md bg-background px-4 py-2 text-nav focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        {t("shell.skipToContent")}
      </a>
      <Header
        toggle={
          <SidebarToggle
            labels={{
              collapse: t("shell.collapseSidebar"),
              expand: t("shell.expandSidebar"),
              openMenu: t("shell.openMenu"),
            }}
          />
        }
        branding={<Branding name={siteName} href={DASHBOARD_PATH} />}
        title={pageTitle}
        subtitle={organization.name}
        breadcrumbs={
          <MenuBreadcrumbs groups={menu} pathname={pathname} homeLabel={t("shell.home")} label={t("shell.breadcrumb")} />
        }
        search={<HeaderSearch label={t("shell.search")} placeholder={t("shell.searchPlaceholder")} />}
        notifications={
          <NotificationsButton
            labels={{
              title: t("shell.notifications"),
              empty: t("shell.noNotifications"),
              unread: (count) => t("shell.notificationsUnread", { count }),
              markAllRead: t("shell.markAllRead"),
              viewAll: t("shell.viewAllNotifications"),
              tabs: {
                all: t("shell.notificationTabs.all"),
                unread: t("shell.notificationTabs.unread"),
                urgent: t("shell.notificationTabs.urgent"),
                invitations: t("shell.notificationTabs.invitations"),
              },
            }}
            items={sampleNotifications}
            viewAllHref="/notifications"
          />
        }
        actions={<DisplaySettingsMenu />}
      />
      <div className="flex flex-1">
        <AppSidebar
          organizationSwitcher={
            <OrganizationSwitcher
              organizations={organizations}
              activeOrganizationId={organization.id}
              onSelect={setActiveOrganization}
              manageHref={manageOrganizationsHref}
              labels={{
                switch: t("organization.switch"),
                search: t("organization.search"),
                noResults: t("organization.noResults"),
                workspaces: t("organization.workspaces"),
                manage: t("organization.manage"),
              }}
            />
          }
          navigation={
            menuQuery.isPending ? (
              <div aria-busy="true" className="flex flex-col gap-2 p-2">
                {Array.from({ length: 6 }, (_, index) => (
                  <Skeleton key={index} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              // A new organization means a new menu: start with fresh expansion state.
              <MenuTree key={organization.id} groups={menu} pathname={pathname} />
            )
          }
          commonMenu={<CommonMenu items={common} pathname={pathname} heading={t("common.resources")} />}
          account={
            <AccountMenu
              user={user}
              items={accountItems}
              onLogout={onLogout}
              labels={{ menu: t("account.menu"), logout: t("account.logout") }}
            />
          }
          labels={{
            navigation: t("shell.mainNavigation"),
            commonNavigation: t("shell.commonNavigation"),
          }}
        />
        {/* The bottom padding keeps content and footer clear of the fixed bottom navigation and the device safe area. */}
        <div className="flex min-w-0 flex-1 flex-col pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))] md:pb-0">
          <SidebarInset id={MAIN_CONTENT_ID} tabIndex={-1} className="min-h-0 flex-1 outline-none">
            {children}
          </SidebarInset>
          <Footer
            links={footer}
            copyright={t("footer.copyright", { year, name: siteName })}
            navigationLabel={t("footer.navigation")}
          />
        </div>
      </div>
      <div className="md:hidden">
        <BottomNav
          groups={menu}
          pathname={pathname}
          slots={bottomNavSlots}
          moreOpen={moreOpen}
          onMoreOpenChange={setBottomNavMoreOpen}
          labels={{
            navigation: t("shell.mobileNavigation"),
            more: t("shell.more"),
            close: t("shell.close"),
          }}
        />
      </div>
    </SidebarProvider>
  );
}
