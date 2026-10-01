import { NextIntlClientProvider } from "next-intl";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider, type CustomThemes } from "bokoui/react/theme";
import type { Session } from "@/lib/types";
import type { UiState } from "@/lib/stores/ui-store";
import { GlobalErrorReporting } from "./global-error-reporting";
import { OrganizationStoreProvider } from "./organization-store-provider";
import { QueryProvider } from "./query-provider";
import { RoleStoreProvider } from "./role-store-provider";
import { SessionExpiry } from "./session-expiry";
import { SessionProvider } from "./session-provider";
import { UiStoreProvider } from "./ui-store-provider";

interface AppProvidersProps {
  /** `null` outside the signed-in area. */
  session: Session | null;
  /** Organization to show first; `null` when there is no session. */
  initialOrganizationId: string | null;
  /** Server-read UI state (collapsed sidebar), so the first render matches what the user left. */
  initialUi: Partial<UiState>;
  /** Role the user chose to act as; `null` means all roles. */
  initialActiveRole?: string | null;
  customThemes?: CustomThemes;
  children: React.ReactNode;
}

/** Every provider of the app in one place; used by the root layout. */
export function AppProviders({
  session,
  initialOrganizationId,
  initialUi,
  initialActiveRole = null,
  customThemes,
  children,
}: AppProvidersProps) {
  const tree = (
    <UiStoreProvider initial={initialUi}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </UiStoreProvider>
  );

  return (
    <NextIntlClientProvider>
      <ThemeProvider customThemes={customThemes}>
        <NuqsAdapter>
          <QueryProvider>
            <GlobalErrorReporting />
            <SessionExpiry />
            {initialOrganizationId ? (
              <OrganizationStoreProvider initial={{ activeOrganizationId: initialOrganizationId }}>
                <RoleStoreProvider initial={{ activeRole: initialActiveRole }}>{tree}</RoleStoreProvider>
              </OrganizationStoreProvider>
            ) : (
              tree
            )}
          </QueryProvider>
        </NuqsAdapter>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
