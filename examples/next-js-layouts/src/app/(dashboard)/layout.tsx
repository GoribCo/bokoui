import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ShellSkeleton } from "@/components/layout/shell-skeleton";
import { NoOrganizations } from "@/components/layout/no-organizations";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { accountMenuItems } from "@/lib/config/account-menu";
import { SIGN_IN_PATH } from "@/lib/config/auth";
import { bottomNavSlots } from "@/lib/config/navigation";
import { features } from "@/lib/config/features";
import { siteConfig } from "@/lib/config/site";
import { getInitialState } from "@/lib/session/initial-state";
import { queryKeys } from "@/lib/query/keys";
import { menuService } from "@/lib/services";

// The signed-in area stays out of search results (FR-11.5).
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Pages that share the application shell. The layout returns at once and shows a skeleton of the shell
 * while `DashboardContent` reads the session and the first menus, so first load never shows a blank page.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<ShellFallback />}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}

/** Synchronous on purpose: a fallback that itself waits would show the root spinner instead. */
function ShellFallback() {
  const t = useTranslations("errors");
  return <ShellSkeleton label={t("loading")} />;
}

/**
 * The session is checked here, close to the data (FR-10.6); the active organization's menu is fetched on
 * the server and handed to the client query cache.
 */
async function DashboardContent({ children }: { children: ReactNode }) {
  const { session, initialOrganizationId } = await getInitialState();
  if (!session) redirect(SIGN_IN_PATH);
  // Signed in, but not part of any organization: there is no menu or role to build a shell from.
  if (!initialOrganizationId) return <NoOrganizations />;

  // Data the shell needs on first paint is fetched here and handed to the client query cache, so the
  // hooks in the shell (`useCommonMenu`, `useOrganizationMenu`) find it ready.
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: queryKeys.commonMenu, queryFn: () => menuService.getCommonMenu(), staleTime: Infinity }),
    initialOrganizationId
      ? queryClient.prefetchQuery({
          queryKey: queryKeys.menu(initialOrganizationId),
          queryFn: () => menuService.getMenu(initialOrganizationId),
        })
      : undefined,
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardShell
        siteName={siteConfig.name}
        accountMenuItems={accountMenuItems}
        footerLinks={siteConfig.footerLinks}
        bottomNavSlots={bottomNavSlots}
        fontSwitcher={features.fontSwitcher}
        styleSwitcher={features.styleSwitcher}
        manageOrganizationsHref="/organizations"
        year={new Date().getFullYear()}
      >
        {children}
      </DashboardShell>
    </HydrationBoundary>
  );
}
