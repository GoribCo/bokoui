import { HttpError, type ApiContext, type ApiHandler } from "./types";
import { getCommonMenu, getMenu } from "./endpoints/menus";
import { listNotifications, markNotificationsRead } from "./endpoints/notifications";
import { getPublicOrganization, listOrganizations, listPublicOrganizations } from "./endpoints/organizations";
import { getMyProfile } from "./endpoints/profiles";
import { listRecords } from "./endpoints/records";
import { getSession } from "./endpoints/session";
import { createStaff } from "./endpoints/staff";

interface Route {
  method: string;
  /** Path under the API prefix; `:name` segments are captured into `context.params`. */
  path: string;
  handler: ApiHandler;
}

/** Every endpoint of the sample backend. Add a handler file under `endpoints/` and one line here. */
const routes: Route[] = [
  { method: "GET", path: "/session", handler: getSession },
  { method: "GET", path: "/organizations", handler: listOrganizations },
  { method: "GET", path: "/organizations/:organizationId/menu", handler: getMenu },
  { method: "GET", path: "/menu/common", handler: getCommonMenu },
  { method: "GET", path: "/public/organizations", handler: listPublicOrganizations },
  { method: "GET", path: "/public/organizations/:type/:slug", handler: getPublicOrganization },
  { method: "GET", path: "/profiles/me", handler: getMyProfile },
  { method: "GET", path: "/notifications", handler: listNotifications },
  { method: "POST", path: "/notifications/read", handler: markNotificationsRead },
  { method: "GET", path: "/records", handler: listRecords },
  { method: "POST", path: "/staff", handler: createStaff },
];

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

const json = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Runs the matching handler and wraps its result in the `{ success, results, meta }` envelope. */
export async function handleApiRequest(request: Request, segments: string[]): Promise<Response> {
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
    const { results, meta, status = 200 } = await found.route.handler(context);
    return json({ success: true, results, ...(meta ? { meta } : {}) }, status);
  } catch (error) {
    if (error instanceof HttpError) return json({ success: false, message: error.message, code: error.code }, error.status);
    console.error(error);
    return json({ success: false, message: "Unexpected error", code: "INTERNAL" }, 500);
  }
}
