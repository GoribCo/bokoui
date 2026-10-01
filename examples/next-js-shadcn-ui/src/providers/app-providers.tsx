import { NextIntlClientProvider } from "next-intl";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "next-themes";
import type { Session } from "@/lib/types";
import type { UiState } from "@/lib/stores/ui-store";
import { OrganizationStoreProvider } from "./organization-store-provider";
import { QueryProvider } from "./query-provider";
import { SessionProvider } from "./session-provider";
import { UiStoreProvider } from "./ui-store-provider";

interface AppProvidersProps {
  /** `null` outside the signed-in area. */
  session: Session | null;
  /** Organization to show first; `null` when there is no session. */
  initialOrganizationId: string | null;
  /** Server-read UI state (collapsed sidebar), so the first render matches what the user left. */
  initialUi: Partial<UiState>;
  children: React.ReactNode;
}

/** Every provider of the app in one place; used by the root layout. */
export function AppProviders({
  session,
  initialOrganizationId,
  initialUi,
  children,
}: AppProvidersProps) {
  const tree = (
    <UiStoreProvider initial={initialUi}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </UiStoreProvider>
  );

  return (
    <NextIntlClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <NuqsAdapter>
          <QueryProvider>
            {initialOrganizationId ? (
              <OrganizationStoreProvider initial={{ activeOrganizationId: initialOrganizationId }}>
                {tree}
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
