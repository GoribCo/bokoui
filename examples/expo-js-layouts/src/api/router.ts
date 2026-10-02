import { endpoints, type EndpointName } from "@/lib/contract";
import { reportError } from "@/lib/monitoring/report-error";
import type { Envelope } from "@/lib/api/client";
import { getCommonMenu, getMenu } from "./endpoints/menus";
import { login, logout, refresh } from "./endpoints/auth";
import { listNotifications, markNotificationsRead } from "./endpoints/notifications";
import { getPublicOrganization, listOrganizations, listPublicOrganizations } from "./endpoints/organizations";
import { getMyProfile } from "./endpoints/profiles";
import { search } from "./endpoints/search";
import { getSession } from "./endpoints/session";
import { HttpError, type ApiContext, type ApiHandler } from "./types";

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
};

/** The route table, built from `lib/contract` so the sample API cannot drift from it. */
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

export interface ApiRequest {
  method: string;
  /** Path under the API base URL, query string included. */
  path: string;
  body?: unknown;
  accessToken: string | null;
}

export interface ApiResponse {
  status: number;
  body: Envelope;
}

const failure = (status: number, message: string, code: string, field?: string): ApiResponse => ({
  status,
  body: { success: false, message, code, field },
});

/** Runs the matching handler and wraps its result in the `{ success, results, meta }` envelope. */
export async function handleApiRequest(request: ApiRequest): Promise<ApiResponse> {
  const url = new URL(request.path, "http://sample.local");
  const segments = url.pathname.split("/").filter(Boolean);
  const candidates = routes.map((route) => ({ route, params: match(route, segments) })).filter((entry) => entry.params);
  if (candidates.length === 0) return failure(404, "Not found", "NOT_FOUND");

  const found = candidates.find((entry) => entry.route.method === request.method);
  if (!found) return failure(405, "Method not allowed", "METHOD_NOT_ALLOWED");

  const context: ApiContext = {
    method: request.method,
    params: found.params ?? {},
    query: url.searchParams,
    body: request.body,
    accessToken: request.accessToken,
  };

  try {
    const { results, meta, status = 200 } = await found.route.handler(context);
    return { status, body: { success: true, results, ...(meta ? { meta } : {}) } };
  } catch (error) {
    if (error instanceof HttpError) return failure(error.status, error.message, error.code ?? "INTERNAL", error.field);
    reportError(error, { source: "api", method: request.method, path: url.pathname });
    return failure(500, "Unexpected error", "INTERNAL");
  }
}
