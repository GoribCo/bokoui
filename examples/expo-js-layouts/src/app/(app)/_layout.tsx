import { Button } from "bokoui/expo/ui";
import { Redirect, Slot, type ErrorBoundaryProps } from "expo-router";
import { useTranslation } from "react-i18next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ErrorView } from "@/components/layout/error-view";
import { PublicFrame } from "@/components/layout/public-frame";
import { ShellSkeleton } from "@/components/layout/shell-skeleton";
import { NoOrganizations } from "@/components/organization/no-organizations";
import { useLogout } from "@/hooks/use-auth";
import { useReturnPath } from "@/hooks/use-return-path";
import { accountMenuItems } from "@/lib/config/account-menu";
import { RETURN_TO_PARAM, SIGN_IN_PATH } from "@/lib/config/auth";
import { features } from "@/lib/config/features";
import { bottomNavSlots } from "@/lib/config/navigation";
import { siteConfig } from "@/lib/config/site";
import { toRoute } from "@/lib/menu";
import { useOptionalSession, useSessionStatus } from "@/providers/session-provider";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <PublicFrame>
      <ErrorView error={error} retry={retry} />
    </PublicFrame>
  );
}

/** Signed in, but not part of any organization: there is no menu or role to build a shell from. */
function WithoutOrganizations() {
  const { t } = useTranslation();
  const logout = useLogout();
  return (
    <PublicFrame signInButton={false} centered>
      <NoOrganizations
        title={t("organization.noneTitle")}
        body={t("organization.noneBody")}
        actions={
          <Button variant="outline" loading={logout.isPending} onPress={() => logout.mutate()}>
            {t("account.logout")}
          </Button>
        }
      />
    </PublicFrame>
  );
}

/**
 * The signed-in area. The session is checked here, in the layout of the route group (FR-10.6): without
 * one the user goes to sign-in with this screen as the return target.
 */
export default function AppLayout() {
  const { t } = useTranslation();
  const status = useSessionStatus();
  const session = useOptionalSession();
  const returnPath = useReturnPath();

  if (status === "loading") return <ShellSkeleton label={t("errors.loading")} />;
  if (!session) return <Redirect href={toRoute(`${SIGN_IN_PATH}?${RETURN_TO_PARAM}=${encodeURIComponent(returnPath)}`)} />;
  if (session.organizations.length === 0) return <WithoutOrganizations />;

  return (
    <DashboardShell
      siteName={siteConfig.name}
      accountMenuItems={accountMenuItems}
      footerLinks={siteConfig.footerLinks}
      bottomNavSlots={bottomNavSlots}
      styleSwitcher={features.styleSwitcher}
      manageOrganizationsHref="/organizations"
      year={new Date().getFullYear()}
    >
      <Slot />
    </DashboardShell>
  );
}
