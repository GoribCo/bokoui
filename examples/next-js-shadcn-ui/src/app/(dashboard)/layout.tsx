import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { accountMenuItems } from "@/lib/config/account-menu";
import { SIGN_IN_PATH } from "@/lib/config/auth";
import { bottomNavSlots } from "@/lib/config/navigation";
import { siteConfig } from "@/lib/config/site";
import { getInitialState } from "@/lib/session/initial-state";
import { signOut } from "@/lib/auth/actions";
import { queryKeys } from "@/lib/query/keys";
import { menuSchema } from "@/lib/schemas";
import { services } from "@/lib/services";

// The signed-in area stays out of search results (FR-11.5).
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Pages that share the application shell. The session is checked here, close to the data (FR-10.6);
 * the active organization's menu is fetched on the server and handed to the client query cache.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { session, initialOrganizationId } = await getInitialState();
  if (!session) redirect(SIGN_IN_PATH);

  const queryClient = new QueryClient();
  const [commonMenu] = await Promise.all([
    services.menus.getCommonMenu(),
    initialOrganizationId
      ? queryClient.prefetchQuery({
          queryKey: queryKeys.menu(initialOrganizationId),
          queryFn: async () => menuSchema.parse(await services.menus.getMenu(initialOrganizationId)),
        })
      : undefined,
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardShell
        siteName={siteConfig.name}
        commonMenu={commonMenu}
        accountMenuItems={accountMenuItems}
        footerLinks={siteConfig.footerLinks}
        bottomNavSlots={bottomNavSlots}
        manageOrganizationsHref="/organizations"
        year={new Date().getFullYear()}
        onLogout={signOut}
      >
        {children}
      </DashboardShell>
    </HydrationBoundary>
  );
}
