"use client";

import { useEffect } from "react";
import { setSessionExpiredHandler } from "@/lib/api/session-expiry";
import { RETURN_TO_PARAM, SIGN_IN_PATH } from "@/lib/config/auth";
import { BaseQuery } from "@/lib/query/base-query";
import { authService } from "@/lib/services";
import { ACTIVE_ORGANIZATION_COOKIE } from "@/lib/stores/organization-store";
import type { SignInValues } from "@/lib/schemas";

/** Sends the browser to sign-in with the current page as the return path. A full load drops every in-memory store. */
function goToSignIn(returnTo?: string) {
  const target = returnTo ? `${SIGN_IN_PATH}?${RETURN_TO_PARAM}=${encodeURIComponent(returnTo)}` : SIGN_IN_PATH;
  window.location.assign(target);
}

class AuthQuery extends BaseQuery {
  login() {
    return this.useMutation({ mutationFn: (values: SignInValues) => authService.login(values) });
  }

  logout() {
    const queryClient = this.useQueryClient();
    return this.useMutation({
      mutationFn: () => authService.logout(),
      // Whether or not the server answered, nothing of this user may stay in the browser.
      onSettled: () => {
        queryClient.clear();
        document.cookie = `${ACTIVE_ORGANIZATION_COOKIE}=; path=/; max-age=0`;
        goToSignIn();
      },
    });
  }

  /** The shared client, for the session-expiry hook below. */
  cache() {
    return this.useQueryClient();
  }
}

const authQuery = new AuthQuery();

/** Signs in. The API sets the token cookies; the caller navigates on success. */
export function useLogin() {
  return authQuery.login();
}

/** Signs out: ends the session on the server, clears the query cache and the stored organization, goes to sign-in. */
export function useLogout() {
  return authQuery.logout();
}

/** Mount once near the root: a 401 that cannot be refreshed signs the user out with a return path. */
export function useSessionExpiry() {
  const queryClient = authQuery.cache();
  useEffect(() => {
    setSessionExpiredHandler(() => {
      queryClient.clear();
      const { pathname, search } = window.location;
      // Already on the sign-in page: nothing to redirect.
      if (pathname !== SIGN_IN_PATH) goToSignIn(`${pathname}${search}`);
    });
    return () => setSessionExpiredHandler(undefined);
  }, [queryClient]);
}
