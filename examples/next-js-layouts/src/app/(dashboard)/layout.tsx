import { HydrationBoundary, QueryClient, dehydrate } from "@/lib/query/react-query";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { accountMenuItems } from "@/lib/config/account-menu";
import { SIGN_IN_PATH } from "@/lib/config/auth";
import { bottomNavSlots } from "@/lib/config/navigation";
import { features } from "@/lib/config/features";
import { siteConfig } from "@/lib/config/site";
import { getInitialState } from "@/lib/session/initial-state";
import { signOut } from "@/lib/auth/actions";
import { queryKeys } from "@/lib/query/keys";
import { getServerServices } from "@/lib/services/server";

// The signed-in area stays out of search results (FR-11.5).
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Pages that share the application shell. The session is checked here, close to the data (FR-10.6);
 * the active organization's menu is fetched on the server and handed to the client query cache.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { session, initialOrganizationId } = await getInitialState();
  if (!session) redirect(SIGN_IN_PATH);

  // Data the shell needs on first paint is fetched here and handed to the client query cache, so the
  // hooks in the shell (`useCommonMenu`, `useOrganizationMenu`) find it ready.
  const services = await getServerServices();
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: queryKeys.commonMenu, queryFn: () => services.menus.getCommonMenu(), staleTime: Infinity }),
    initialOrganizationId
      ? queryClient.prefetchQuery({
          queryKey: queryKeys.menu(initialOrganizationId),
          queryFn: () => services.menus.getMenu(initialOrganizationId),
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
        onLogout={signOut}
      >
        {children}
      </DashboardShell>
    </HydrationBoundary>
  );
}
