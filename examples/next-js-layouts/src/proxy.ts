import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  DASHBOARD_PATH,
  REFRESH_TOKEN_COOKIE,
  RETURN_TO_PARAM,
  SIGN_IN_PATH,
} from "@/lib/config/auth";
import { isPublicPath } from "@/lib/auth/paths";
import { API_BASE_URL } from "@/lib/api/client";

/** True when the JWT is missing or its `exp` has passed. The signature is checked by the API, not here. */
function isExpired(token: string | undefined): boolean {
  if (!token) return true;
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    return typeof exp !== "number" || exp <= Date.now() / 1000;
  } catch {
    return true;
  }
}

/**
 * Asks the API for a new token pair using the refresh cookie. Returns the `Set-Cookie` lines on success.
 * Doing it here means Server Components render with a fresh token and need no refresh logic of their own.
 */
async function refreshTokens(request: NextRequest): Promise<string[] | null> {
  const base = /^https?:\/\//.test(API_BASE_URL) ? API_BASE_URL : `${request.nextUrl.origin}${API_BASE_URL}`;
  try {
    const response = await fetch(`${base}/auth/refresh`, { method: "POST", headers: { cookie: request.headers.get("cookie") ?? "" } });
    return response.ok ? response.headers.getSetCookie() : null;
  } catch {
    return null;
  }
}

/** Cookie header for the rest of this request: the old cookies with the refreshed ones on top. */
function mergeCookies(request: NextRequest, setCookies: string[]): string {
  const jar = new Map(request.cookies.getAll().map(({ name, value }) => [name, value]));
  for (const line of setCookies) {
    const [pair] = line.split(";");
    const index = pair.indexOf("=");
    const value = decodeURIComponent(pair.slice(index + 1));
    if (value) jar.set(pair.slice(0, index), pair.slice(index + 1));
    else jar.delete(pair.slice(0, index));
  }
  return [...jar].map(([name, value]) => `${name}=${value}`).join("; ");
}

/**
 * Optimistic check only: no usable token means a redirect to sign-in without touching the data layer. An
 * expired access token with a refresh cookie is refreshed first. The authoritative session and role checks
 * happen in layouts, pages and the API (FR-10.6).
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const access = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const hasRefresh = request.cookies.has(REFRESH_TOKEN_COOKIE);

  let refreshed: string[] | null = null;
  if (isExpired(access) && hasRefresh) refreshed = await refreshTokens(request);
  const signedIn = !isExpired(access) || refreshed !== null;

  let response: NextResponse;
  if (isPublicPath(pathname)) {
    // A signed-in user has no reason to see the landing page or the sign-in form.
    response =
      signedIn && (pathname === "/" || pathname === SIGN_IN_PATH)
        ? NextResponse.redirect(new URL(DASHBOARD_PATH, request.url))
        : NextResponse.next();
  } else if (!signedIn) {
    const url = new URL(SIGN_IN_PATH, request.url);
    url.searchParams.set(RETURN_TO_PARAM, `${pathname}${search}`);
    response = NextResponse.redirect(url);
  } else if (refreshed) {
    const headers = new Headers(request.headers);
    headers.set("cookie", mergeCookies(request, refreshed));
    response = NextResponse.next({ request: { headers } });
  } else {
    response = NextResponse.next();
  }

  for (const line of refreshed ?? []) response.headers.append("Set-Cookie", line);
  return response;
}

export const config = {
  // Skip API routes, Next.js internals, metadata files and any path with a file extension.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
