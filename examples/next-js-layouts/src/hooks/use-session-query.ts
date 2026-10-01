"use client";

import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { sessionService } from "@/lib/services";
import type { Session } from "@/lib/types";

class SessionQuery extends BaseQuery {
  /** `null` (signed out) never triggers a request. */
  get(initialSession: Session | null) {
    return this.useQuery({
      queryKey: queryKeys.session,
      queryFn: () => sessionService.getSession(),
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
