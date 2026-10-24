import { ACCESS_TOKEN_COOKIE } from "@/lib/config/auth";
import { verifyToken } from "./jwt";
import { HttpError, type ApiContext } from "./types";

/** True when the request carries a valid, unexpired access token. */
export function isSignedIn(context: ApiContext): boolean {
  return verifyToken(context.cookies[ACCESS_TOKEN_COOKIE], "access") !== null;
}

/** Guard for protected endpoints: 401 without a valid access token. Returns the user id. */
export function requireSession(context: ApiContext): string {
  const payload = verifyToken(context.cookies[ACCESS_TOKEN_COOKIE], "access");
  if (!payload) throw new HttpError(401, "Sign in to continue", "UNAUTHENTICATED");
  return payload.sub;
}
