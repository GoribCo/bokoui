/** Lifetimes the sample API issues; a real API decides its own. */
export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

/** Home of the signed-in area; signed-in users who open the landing screen or sign-in are sent here. */
export const DASHBOARD_PATH = "/dashboard";

/** Where unauthenticated users are sent. */
export const SIGN_IN_PATH = "/sign-in";

/** Search parameter carrying the screen to return to after sign-in. */
export const RETURN_TO_PARAM = "next";

/** Screens anyone can open (besides organization profiles, see `lib/auth/paths.ts`). */
export const PUBLIC_PATH_PREFIXES = ["/sign-in", "/legal", "/help", "/contact"] as const;

/** Accounts the sample API understands (any password works); listed on the sign-in screen. `labelKey` is under `auth.`. */
export const sampleAccounts = [
  { email: "amina.rahman@example.com", labelKey: "sampleNormal" },
  { email: "empty@example.com", labelKey: "sampleEmpty" },
  { email: "many@example.com", labelKey: "sampleMany" },
] as const;
