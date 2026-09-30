import { NextResponse, type NextRequest } from "next/server";
import { RETURN_TO_PARAM, SESSION_COOKIE, SIGN_IN_PATH } from "@/lib/config/auth";
import { isPublicPath } from "@/lib/auth/paths";

/**
 * Optimistic check only: no session cookie means a redirect to sign-in without touching the data layer.
 * The authoritative session and role checks happen in layouts and pages (FR-10.6).
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = request.cookies.has(SESSION_COOKIE);

  if (isPublicPath(pathname)) {
    // A signed-in user has no reason to see the sign-in form.
    if (signedIn && pathname === SIGN_IN_PATH) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (!signedIn) {
    const url = new URL(SIGN_IN_PATH, request.url);
    url.searchParams.set(RETURN_TO_PARAM, `${pathname}${search}`);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Skip API routes, Next.js internals, metadata files and any path with a file extension.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
