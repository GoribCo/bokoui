import { ACCESS_TOKEN_COOKIE } from "@/lib/config/auth";
import { verifyToken } from "./jwt";
import { profile } from "./data/organizations";
import { HttpError, type ApiContext } from "./types";

/** Static demo (GitHub Pages): no server, no cookies; every request acts as the sample user. */
const DEMO = process.env.NEXT_PUBLIC_DEMO === "true";

/** True when the request carries a valid, unexpired access token. */
export function isSignedIn(context: ApiContext): boolean {
  if (DEMO) return true;
  return verifyToken(context.cookies[ACCESS_TOKEN_COOKIE], "access") !== null;
}

/** Guard for protected endpoints: 401 without a valid access token. Returns the user id. */
export function requireSession(context: ApiContext): string {
  if (DEMO) return profile.id;
  const payload = verifyToken(context.cookies[ACCESS_TOKEN_COOKIE], "access");
  if (!payload) throw new HttpError(401, "Sign in to continue", "UNAUTHENTICATED");
  return payload.sub;
}
