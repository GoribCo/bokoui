import { login, logout, refresh } from "./endpoints/auth";
import { reportError } from "@/lib/monitoring/report-error";
import { endpoints, type EndpointName } from "@/lib/contract";
import { HttpError, type ApiContext, type ApiCookie, type ApiHandler } from "./types";
import { getCommonMenu, getMenu } from "./endpoints/menus";
import { listNotifications, markNotificationsRead } from "./endpoints/notifications";
import { getPublicOrganization, listOrganizations, listPublicOrganizations } from "./endpoints/organizations";
import { getMyProfile } from "./endpoints/profiles";
import { listRecords } from "./endpoints/records"; // demo
import { search } from "./endpoints/search";
import { getSession } from "./endpoints/session";
import { createStaff } from "./endpoints/staff"; // demo

interface Route {
  method: string;
  /** Path under the API prefix; `:name` segments are captured into `context.params`. */
  path: string;
  handler: ApiHandler;
}

/** One handler per endpoint of the contract; the type fails to compile when one is missing or extra. */
const handlers: Record<EndpointName, ApiHandler> = {
  login,
  refresh,
  logout,
  getSession,
  listOrganizations,
  getMenu,
  getCommonMenu,
  listPublicOrganizations,
  getPublicOrganization,
  getMyProfile,
  search,
  listNotifications,
  markNotificationsRead,
  listRecords, // demo
  createStaff, // demo
};

/** The route table, built from `lib/contract` so the sample backend cannot drift from it. */
const routes: Route[] = (Object.keys(endpoints) as EndpointName[]).map((name) => ({
  method: endpoints[name].method,
  path: endpoints[name].path,
  handler: handlers[name],
}));

function match(route: Route, segments: string[]): Record<string, string> | null {
  const pattern = route.path.split("/").filter(Boolean);
  if (pattern.length !== segments.length) return null;
  const params: Record<string, string> = {};
  for (const [index, part] of pattern.entries()) {
    if (part.startsWith(":")) params[part.slice(1)] = decodeURIComponent(segments[index]);
    else if (part !== segments[index]) return null;
  }
  return params;
}

function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  for (const pair of (header ?? "").split(";")) {
    const separator = pair.indexOf("=");
    if (separator > 0) cookies[pair.slice(0, separator).trim()] = decodeURIComponent(pair.slice(separator + 1).trim());
  }
  return cookies;
}

function json(body: unknown, status: number, cookies: ApiCookie[] = []) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  for (const { name, value, maxAge } of cookies) {
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    headers.append("Set-Cookie", `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`);
  }
  return Response.json(body, { status, headers });
}

/** Runs the matching handler and wraps its result in the `{ success, results, meta }` envelope. */
export async function handleApiRequest(request: Request, segments: string[]): Promise<Response> {
  // The sample backend has no real users or storage: it must never serve production traffic by accident.
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_SAMPLE_API !== "true" && process.env.NEXT_PUBLIC_DEMO !== "true") {
    return json({ success: false, message: "The sample API is disabled in production", code: "SAMPLE_API_DISABLED" }, 503);
  }
  const candidates = routes.map((route) => ({ route, params: match(route, segments) })).filter((entry) => entry.params);
  if (candidates.length === 0) return json({ success: false, message: "Not found", code: "NOT_FOUND" }, 404);

  const found = candidates.find((entry) => entry.route.method === request.method);
  if (!found) return json({ success: false, message: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);

  const body = request.method === "GET" ? undefined : await request.json().catch(() => undefined);
  const context: ApiContext = {
    method: request.method,
    params: found.params ?? {},
    query: new URL(request.url).searchParams,
    body,
    cookies: parseCookies(request.headers.get("cookie")),
  };

  try {
    const { results, meta, status = 200, cookies } = await found.route.handler(context);
    return json({ success: true, results, ...(meta ? { meta } : {}) }, status, cookies);
  } catch (error) {
    if (error instanceof HttpError) return json({ success: false, message: error.message, code: error.code, field: error.field }, error.status);
    reportError(error, { source: "api", method: request.method, path: new URL(request.url).pathname });
    return json({ success: false, message: "Unexpected error", code: "INTERNAL" }, 500);
  }
}
