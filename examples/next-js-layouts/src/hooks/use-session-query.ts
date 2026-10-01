"use client";

import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { SessionService } from "@/lib/services/session.service";
import type { Session } from "@/lib/types";

class SessionQuery extends BaseQuery {
  private readonly service = new SessionService();

  /** `null` (signed out) never triggers a request. */
  get(initialSession: Session | null) {
    return this.useQuery({
      queryKey: queryKeys.session,
      queryFn: () => this.service.getSession(),
      initialData: initialSession,
      enabled: initialSession !== null,
      staleTime: 5 * 60 * 1000,
    });
  }
}

const sessionQuery = new SessionQuery();

/**
 * The session as server state. The server passes what it already read as `initialSession`, so the first
 * render needs no request.
 */
export function useSessionQuery(initialSession: Session | null) {
  return sessionQuery.get(initialSession);
}
