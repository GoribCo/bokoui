import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { sessionService } from "@/lib/services";

class SessionQuery extends BaseQuery {
  /** `null` means signed out; without stored tokens no request is made at all. */
  get() {
    return this.useQuery({
      queryKey: queryKeys.session,
      queryFn: () => sessionService.getSession(),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true, // roles may have changed while the app was in the background
    });
  }
}

const sessionQuery = new SessionQuery();

/** The session as server state: `data` is the session, `null` when signed out, `undefined` while loading. */
export function useSessionQuery() {
  return sessionQuery.get();
}
