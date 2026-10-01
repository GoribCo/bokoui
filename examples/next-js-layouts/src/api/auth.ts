import { SESSION_COOKIE } from "@/lib/config/auth";
import { HttpError, type ApiContext } from "./types";

/** True when the request carries the session cookie. A real backend verifies a token or a server session here. */
export function isSignedIn(context: ApiContext): boolean {
  return SESSION_COOKIE in context.cookies;
}

/** Guard for protected endpoints: 401 without a session. */
export function requireSession(context: ApiContext): void {
  if (!isSignedIn(context)) throw new HttpError(401, "Sign in to continue", "UNAUTHENTICATED");
}
