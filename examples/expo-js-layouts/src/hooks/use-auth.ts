import { useEffect } from "react";
import { setSessionExpiredHandler } from "@/lib/api/session-expiry";
import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { authService } from "@/lib/services";
import { organizationStore, roleStore } from "@/lib/stores";
import type { SignInValues } from "@/lib/schemas";
import type { QueryClient } from "@tanstack/react-query";

/** Forgets everything of the signed-in user: cached server data, the remembered organization and role. */
async function clearUserState(queryClient: QueryClient) {
  await queryClient.cancelQueries();
  // The session query stays (its observers keep watching it); it just becomes "signed out".
  queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== queryKeys.session[0] });
  queryClient.setQueryData(queryKeys.session, null);
  organizationStore.getState().setActiveOrganization(null);
  roleStore.getState().setActiveRole(null);
}

class AuthQuery extends BaseQuery {
  login() {
    const queryClient = this.useQueryClient();
    return this.useMutation({
      mutationFn: (values: SignInValues) => authService.login(values),
      // Returning the promise makes the mutation wait until the session is loaded, so guards see it.
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.session }),
    });
  }

  logout() {
    const queryClient = this.useQueryClient();
    return this.useMutation({
      mutationFn: () => authService.logout(),
      // Whether or not the server answered, nothing of this user may stay on the device.
      onSettled: () => clearUserState(queryClient),
    });
  }

  /** The shared client, for the session-expiry hook below. */
  cache() {
    return this.useQueryClient();
  }
}

const authQuery = new AuthQuery();

/** Signs in. The tokens go to secure storage; the caller navigates on success. */
export function useLogin() {
  return authQuery.login();
}

/** Signs out: ends the session on the server, clears cached data, the stored organization and role. */
export function useLogout() {
  return authQuery.logout();
}

/**
 * Mount once near the root: a 401 that cannot be refreshed ends the session. The `(app)` guard then sends
 * the user to sign-in with the screen they were on as the return target.
 */
export function useSessionExpiry() {
  const queryClient = authQuery.cache();
  useEffect(() => {
    setSessionExpiredHandler(() => {
      void clearUserState(queryClient);
    });
    return () => setSessionExpiredHandler(undefined);
  }, [queryClient]);
}
