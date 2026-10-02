import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useSessionQuery } from "@/hooks/use-session-query";
import { effectiveRoles } from "@/lib/access";
import type { Role, Session } from "@/lib/types";

export interface SessionContextValue extends Session {
  /** Effective roles (union) per organization id. */
  rolesByOrganization: Record<string, Role[]>;
}

export type SessionStatus = "loading" | "signedOut" | "signedIn";

interface SessionState {
  status: SessionStatus;
  session: SessionContextValue | null;
}

const SessionContext = createContext<SessionState>({ status: "loading", session: null });

/** Provides the session to the whole app, including the public screens (where it is `null`). */
export function SessionProvider({ children }: { children: ReactNode }) {
  const { data, isPending } = useSessionQuery();
  const value = useMemo<SessionState>(() => {
    if (isPending) return { status: "loading", session: null };
    if (!data) return { status: "signedOut", session: null };
    const rolesByOrganization = Object.fromEntries(
      data.organizations.map((org) => [org.id, effectiveRoles(data.organizations, org.id)]),
    );
    return { status: "signedIn", session: { ...data, rolesByOrganization } };
  }, [data, isPending]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/** Where the session stands: still loading, signed out or signed in. Guards read this. */
export function useSessionStatus(): SessionStatus {
  return useContext(SessionContext).status;
}

/** The session, or `null` when signed out or still loading. */
export function useOptionalSession(): SessionContextValue | null {
  return useContext(SessionContext).session;
}

/** The session of the signed-in area; throws when used where no session exists. */
export function useSession(): SessionContextValue {
  const { session } = useContext(SessionContext);
  if (!session) throw new Error("useSession requires a signed-in session");
  return session;
}
