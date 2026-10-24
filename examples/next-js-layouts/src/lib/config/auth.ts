/**
 * httpOnly cookies holding the JWT pair. The API sets and clears them (`/auth/login`, `/auth/refresh`,
 * `/auth/logout`); the browser, Server Components and the proxy all send them.
 */
export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

/** Lifetimes the sample backend issues; a real API decides its own. */
export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

/** Home of the signed-in area; signed-in users who open the landing page or sign-in form are sent here. */
export const DASHBOARD_PATH = "/dashboard";

/** Where unauthenticated users are sent. */
export const SIGN_IN_PATH = "/sign-in";

/** Query parameter carrying the page to return to after sign-in. */
export const RETURN_TO_PARAM = "next";

/** Pages anyone can open (besides organization profiles, see `lib/auth/paths.ts`). */
export const PUBLIC_PATH_PREFIXES = ["/sign-in", "/legal", "/help", "/contact"] as const;
