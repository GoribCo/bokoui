"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { effectiveRoles } from "@/lib/access";
import type { Role, Session } from "@/lib/types";

export interface SessionContextValue extends Session {
  /** Effective roles (union) per organization id. */
  rolesByOrganization: Record<string, Role[]>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

/** `session` is `null` outside the signed-in area (public pages, sign-in). */
export function SessionProvider({ session, children }: { session: Session | null; children: ReactNode }) {
  const value = useMemo<SessionContextValue | null>(() => {
    if (!session) return null;
    const rolesByOrganization = Object.fromEntries(
      session.organizations.map((org) => [org.id, effectiveRoles(session.organizations, org.id)]),
    );
    return { ...session, rolesByOrganization };
  }, [session]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/** The session, or `null` when signed out. */
export function useOptionalSession(): SessionContextValue | null {
  return useContext(SessionContext);
}

/** The session of the signed-in area; throws when used where no session exists. */
export function useSession(): SessionContextValue {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession requires a signed-in session");
  return session;
}
