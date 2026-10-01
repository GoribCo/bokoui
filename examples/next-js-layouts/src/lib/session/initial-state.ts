import { cookies } from "next/headers";
import { cache } from "react";
import { resolveActiveOrganizationId } from "@/lib/organization/active-organization";
import { getSession } from "@/lib/session/session";
import { ACTIVE_ORGANIZATION_COOKIE } from "@/lib/stores/organization-store";
import { ACTIVE_ROLE_COOKIE, parseRoleCookie } from "@/lib/stores/role-store";
import { SIDEBAR_COOKIE, parseSidebarCookie, type UiState } from "@/lib/stores/ui-store";
import type { Session } from "@/lib/types";

export interface InitialState {
  session: Session | null;
  initialOrganizationId: string | null;
  initialUi: Partial<UiState>;
  /** Role the user chose to act as, or `null` for all roles. */
  initialActiveRole: string | null;
}

/**
 * Reads what the client stores remember (cookies) on the server, so the first render already has the
 * right sidebar width and organization menu: no layout shift when state is restored (NFR-2).
 * Cached per request, so the root and dashboard layouts share one read.
 */
export const getInitialState = cache(async (): Promise<InitialState> => {
  const [session, cookieStore] = await Promise.all([getSession(), cookies()]);
  return {
    session,
    initialOrganizationId: session
      ? resolveActiveOrganizationId(
          session.organizations,
          cookieStore.get(ACTIVE_ORGANIZATION_COOKIE)?.value,
          session.defaultOrganizationId,
        )
      : null,
    initialActiveRole: parseRoleCookie(cookieStore.get(ACTIVE_ROLE_COOKIE)?.value),
    initialUi: { sidebarCollapsed: parseSidebarCookie(cookieStore.get(SIDEBAR_COOKIE)?.value) },
  };
});
