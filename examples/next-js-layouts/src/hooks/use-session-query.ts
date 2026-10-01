"use client";

import { useQuery } from "@/lib/query/react-query";
import { queryKeys } from "@/lib/query/keys";
import { services } from "@/lib/services";
import type { Session } from "@/lib/types";

/**
 * The session as server state. The server passes what it already read as `initialSession`, so the first
 * render needs no request; `null` (signed out) never triggers one.
 */
export function useSessionQuery(initialSession: Session | null) {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: () => services.session.getSession(),
    initialData: initialSession,
    enabled: initialSession !== null,
    staleTime: 5 * 60 * 1000,
  });
}
