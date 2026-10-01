/** Cookie holding the mock session (replaced by the real session cookie of the target project). */
export const SESSION_COOKIE = "session";

/** Home of the signed-in area; signed-in users who open the landing page or sign-in form are sent here. */
export const DASHBOARD_PATH = "/dashboard";

/** Where unauthenticated users are sent. */
export const SIGN_IN_PATH = "/sign-in";

/** Query parameter carrying the page to return to after sign-in. */
export const RETURN_TO_PARAM = "next";

/** Pages anyone can open (besides organization profiles, see `lib/auth/paths.ts`). */
export const PUBLIC_PATH_PREFIXES = ["/sign-in", "/legal", "/help", "/contact"] as const;
