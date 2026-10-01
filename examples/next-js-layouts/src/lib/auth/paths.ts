import { DASHBOARD_PATH, PUBLIC_PATH_PREFIXES } from "@/lib/config/auth";
import { organizationSegments } from "@/lib/organization/organization-types";

const publicPrefixes = [...PUBLIC_PATH_PREFIXES, ...organizationSegments.map((segment) => `/${segment}`)];

/** Public pages need no session: the landing page, sign-in, legal pages and the organization profiles (FR-10.6). */
export function isPublicPath(pathname: string): boolean {
  return pathname === "/" || publicPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/** Accepts only same-site relative paths, so a crafted `next` parameter cannot redirect elsewhere. */
export function safeReturnPath(value: string | null | undefined): string {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : DASHBOARD_PATH;
}
