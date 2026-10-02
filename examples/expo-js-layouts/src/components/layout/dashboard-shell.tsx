import { Skeleton, useTheme } from "bokoui/expo";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react-native";
import { usePathname, useRouter } from "expo-router";
import { useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { AccountMenu } from "@/components/account/account-menu";
import { DisplaySettings } from "@/components/appearance/display-settings";
import { CommonMenu } from "@/components/navigation/common-menu";
import { MenuTree } from "@/components/navigation/menu-tree";
import { OrganizationSwitcher } from "@/components/organization/organization-switcher";
import { RoleSwitcher } from "@/components/organization/role-switcher";
import { useActiveOrganization } from "@/hooks/use-active-organization";
import { useLogout } from "@/hooks/use-auth";
import { useCommonMenu } from "@/hooks/use-common-menu";
import { useFooterLinks } from "@/hooks/use-footer-links";
import { useIsWide } from "@/hooks/use-is-wide";
import { useNotificationLabels } from "@/hooks/use-notification-labels";
import { useMarkNotificationsRead, useNotifications } from "@/hooks/use-notifications";
import { useMenu } from "@/hooks/use-menu";
import { useMenuTranslator } from "@/hooks/use-menu-translator";
import { useOrganizationMenu } from "@/hooks/use-organization-menu";
import { DASHBOARD_PATH } from "@/lib/config/auth";
import { findActiveTrail, localizeMenu, toRoute } from "@/lib/menu";
import { uiSelectors, useUiActions, useUiStore } from "@/lib/stores";
import type { FooterLink, MenuGroup, MenuItem, Notification } from "@/lib/types";
import { useSession } from "@/providers/session-provider";
import { AppShell } from "./app-shell";
import { BottomNav } from "./bottom-nav";
import { Branding } from "./branding";
import { Footer } from "./footer";
import { Header } from "./header";
import { HeaderSearch } from "./header-search";
import { IconButton } from "./icon-button";
import { MobileDrawer } from "./mobile-drawer";
import { NotificationsButton } from "./notifications-button";
import { QueryError } from "./query-error";
import { ScreenTitleProvider, useScreenTitleValue } from "./screen-title";
import { Sidebar } from "./sidebar";

const NO_GROUPS: MenuGroup[] = [];
const NO_ITEMS: MenuItem[] = [];
const NO_NOTIFICATIONS: Notification[] = [];

export interface DashboardShellProps {
  siteName: string;
  accountMenuItems: MenuItem[];
  footerLinks: FooterLink[];
  /** Slots in the phone bottom navigation (see `config/navigation.ts`). */
  bottomNavSlots: number;
  styleSwitcher?: boolean;
  /** Target of "Manage workspaces"; the link is hidden when unset. */
  manageOrganizationsHref?: string;
  /** Current year for the copyright line. */
  year: number;
  children: ReactNode;
}

/**
 * Connects the session, stores, menu queries and router to the presentational shell parts. All data
 * arrives through props and hooks; swapping the data source never touches the parts it renders.
 */
function Shell({ siteName, accountMenuItems, footerLinks, bottomNavSlots, styleSwitcher = true, manageOrganizationsHref, year, children }: DashboardShellProps) {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const wide = useIsWide();
  const { user } = useSession();
  const { organization, organizations, setActiveOrganization, allRoles, activeRole, setActiveRole } = useActiveOrganization();
  const translate = useMenuTranslator();
  const notificationLabels = useNotificationLabels();
  const screenTitle = useScreenTitleValue();

  const menuQuery = useOrganizationMenu(organization.id);
  const commonMenuQuery = useCommonMenu();
  const notificationsQuery = useNotifications();
  const markRead = useMarkNotificationsRead();
  const logout = useLogout();
  const menu = useMenu(menuQuery.data ?? NO_GROUPS);
  const common = useMemo(() => localizeMenu([{ id: "common", label: "", items: commonMenuQuery.data ?? NO_ITEMS }], translate)[0]?.items ?? [], [commonMenuQuery.data, translate]);
  const accountItems = useMemo(() => localizeMenu([{ id: "account", label: "", items: accountMenuItems }], translate)[0]?.items ?? [], [accountMenuItems, translate]);
  const footer = useFooterLinks(footerLinks);

  const collapsed = useUiStore(uiSelectors.sidebarCollapsed);
  const drawerOpen = useUiStore(uiSelectors.drawerOpen);
  const moreOpen = useUiStore(uiSelectors.bottomNavMoreOpen);
  const { setSidebarCollapsed, toggleSidebar, setDrawerOpen, setBottomNavMoreOpen } = useUiActions();

  const manage = manageOrganizationsHref ? () => router.push(toRoute(manageOrganizationsHref)) : undefined;
  const switcherLabels = {
    switch: t("organization.switch"),
    search: t("organization.search"),
    noResults: t("organization.noResults"),
    workspaces: t("organization.workspaces"),
    manage: t("organization.manage"),
    close: t("shell.close"),
  };
  const accountLabels = { menu: t("account.menu"), logout: t("account.logout"), close: t("shell.close") };

  const switcher = (railCollapsed: boolean) => (
    <View style={{ gap: 8 }}>
      <OrganizationSwitcher organizations={organizations} activeOrganizationId={organization.id} onSelect={setActiveOrganization} collapsed={railCollapsed} onManage={manage} labels={switcherLabels} />
      {railCollapsed ? null : <RoleSwitcher roles={allRoles} activeRole={activeRole} onChange={setActiveRole} labels={{ role: t("organization.role"), allRoles: t("organization.allRoles") }} />}
    </View>
  );
  const navigation = (railCollapsed: boolean, onNavigate?: () => void) =>
    menuQuery.isPending ? (
      <View accessibilityState={{ busy: true }} style={{ gap: 8, padding: 4 }}>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} height={36} />
        ))}
      </View>
    ) : menuQuery.isError ? (
      <QueryError error={menuQuery.error} onRetry={() => void menuQuery.refetch()} />
    ) : (
      // A new organization means a new menu: start with fresh expansion state.
      <MenuTree key={organization.id} groups={menu} pathname={pathname} collapsed={railCollapsed} onNavigate={onNavigate} onRequestExpand={() => setSidebarCollapsed(false)} />
    );
  const commonLinks = (railCollapsed: boolean, onNavigate?: () => void) => (
    <CommonMenu items={common} pathname={pathname} collapsed={railCollapsed} onNavigate={onNavigate} heading={t("common.resources")} />
  );
  const account = (railCollapsed: boolean, onNavigate?: () => void) => (
    <AccountMenu user={user} items={accountItems} onLogout={() => logout.mutate()} collapsed={railCollapsed} onNavigate={onNavigate} labels={accountLabels} />
  );

  const pageTitle = screenTitle ?? findActiveTrail(menu, pathname)?.items.at(-1)?.label ?? t("shell.pageTitleFallback");
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <AppShell
      sidebar={
        wide ? (
          <Sidebar
            collapsed={collapsed}
            organizationSwitcher={switcher(collapsed)}
            navigation={navigation(collapsed)}
            commonMenu={commonLinks(collapsed)}
            account={account(collapsed)}
            labels={{ navigation: t("shell.mainNavigation") }}
          />
        ) : null
      }
      header={
        <Header
          leading={
            wide ? (
              <IconButton
                label={collapsed ? t("shell.expandSidebar") : t("shell.collapseSidebar")}
                icon={collapsed ? <PanelLeftOpen size={20} color={tokens.fg} /> : <PanelLeftClose size={20} color={tokens.fg} />}
                accessibilityState={{ expanded: !collapsed }}
                onPress={toggleSidebar}
              />
            ) : (
              <IconButton label={t("shell.openMenu")} icon={<Menu size={20} color={tokens.fg} />} accessibilityState={{ expanded: drawerOpen }} onPress={() => setDrawerOpen(true)} />
            )
          }
          branding={wide ? <Branding name={siteName} onPress={() => router.push(toRoute(DASHBOARD_PATH))} /> : undefined}
          title={pageTitle}
          subtitle={organization.name}
          search={<HeaderSearch menuGroups={menu} />}
          notifications={
            <NotificationsButton
              labels={notificationLabels}
              items={notificationsQuery.data ?? NO_NOTIFICATIONS}
              onMarkRead={(ids) => markRead.mutate(ids)}
              viewAllHref="/notifications"
            />
          }
          actions={<DisplaySettings styleSwitcher={styleSwitcher} />}
        />
      }
      footer={<Footer links={footer} copyright={t("footer.copyright", { year, name: siteName })} navigationLabel={t("footer.navigation")} />}
      overlays={
        wide ? null : (
          <MobileDrawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            title={t("shell.mainNavigation")}
            closeLabel={t("shell.close")}
            organizationSwitcher={switcher(false)}
            navigation={navigation(false, closeDrawer)}
            commonMenu={commonLinks(false, closeDrawer)}
            account={account(false, closeDrawer)}
          />
        )
      }
      bottomNav={
        wide ? null : (
          <BottomNav
            groups={menu}
            pathname={pathname}
            slots={bottomNavSlots}
            moreOpen={moreOpen}
            onMoreOpenChange={setBottomNavMoreOpen}
            labels={{ navigation: t("shell.mobileNavigation"), more: t("shell.more"), close: t("shell.close") }}
          />
        )
      }
    >
      {children}
    </AppShell>
  );
}

/** The application shell for signed-in screens, with the title context its screens announce into. */
export function DashboardShell(props: DashboardShellProps) {
  return (
    <ScreenTitleProvider>
      <Shell {...props} />
    </ScreenTitleProvider>
  );
}
