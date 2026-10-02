import { z } from "zod";
import {
  menuItemSchema,
  menuSchema,
  notificationSchema,
  organizationSchema,
  profileSchema,
  publicOrganizationSchema,
  searchResultSchema,
  logoutRequestSchema,
  refreshRequestSchema,
  sessionSchema,
  signInResultSchema,
  signInSchema,
  tokenPairSchema,
} from "@/lib/schemas";

export { errorCodes, type ErrorCode } from "./errors";
export { pageMetaSchema, pageQuerySchema, type PageMeta, type PageQuery } from "./paging";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** One endpoint of the API. Answers come in the `{ success, results, meta? }` envelope; `response` describes `results`. */
export interface Endpoint<TResponse extends z.ZodType = z.ZodType> {
  method: HttpMethod;
  /** Path under the API base URL; `:name` segments are filled from `params`. */
  path: string;
  /** Needs a signed-in user (401 `UNAUTHENTICATED` otherwise). */
  auth: boolean;
  /** Request body, when there is one. */
  request?: z.ZodType;
  /** Shape of `results`; for a paged endpoint, of one item (`results` is a list of them, with `meta`). */
  response: TResponse;
  paged?: boolean;
}

const defineEndpoint = <TResponse extends z.ZodType>(endpoint: Endpoint<TResponse>) => endpoint;

const markReadRequest = z.object({ ids: z.array(z.string()).optional() });

/**
 * The single description of the API. `src/api` (the sample backend) implements exactly these endpoints
 * (its route table is built from here) and the services call them through `BaseService.request`, so the
 * two cannot drift. A real backend implements the same contract, or this file is updated first.
 */
export const endpoints = {
  login: defineEndpoint({ method: "POST", path: "/auth/login", auth: false, request: signInSchema, response: signInResultSchema }),
  refresh: defineEndpoint({ method: "POST", path: "/auth/refresh", auth: false, request: refreshRequestSchema, response: tokenPairSchema }),
  logout: defineEndpoint({ method: "POST", path: "/auth/logout", auth: false, request: logoutRequestSchema, response: z.null() }),
  getSession: defineEndpoint({ method: "GET", path: "/session", auth: true, response: sessionSchema }),
  listOrganizations: defineEndpoint({ method: "GET", path: "/organizations", auth: true, response: z.array(organizationSchema) }),
  getMenu: defineEndpoint({ method: "GET", path: "/organizations/:organizationId/menu", auth: true, response: menuSchema }),
  getCommonMenu: defineEndpoint({ method: "GET", path: "/menu/common", auth: true, response: z.array(menuItemSchema) }),
  listPublicOrganizations: defineEndpoint({ method: "GET", path: "/public/organizations", auth: false, response: z.array(publicOrganizationSchema) }),
  getPublicOrganization: defineEndpoint({ method: "GET", path: "/public/organizations/:type/:slug", auth: false, response: publicOrganizationSchema }),
  getMyProfile: defineEndpoint({ method: "GET", path: "/profiles/me", auth: true, response: profileSchema }),
  /** Query: `scope` (see `lib/config/search.ts`, not `menu`) and `q`. Fewer than two characters answer an empty list. */
  search: defineEndpoint({ method: "GET", path: "/search", auth: true, response: z.array(searchResultSchema) }),
  listNotifications: defineEndpoint({ method: "GET", path: "/notifications", auth: true, response: z.array(notificationSchema) }),
  markNotificationsRead: defineEndpoint({ method: "POST", path: "/notifications/read", auth: true, request: markReadRequest, response: z.array(notificationSchema) }),
} as const;

export type EndpointName = keyof typeof endpoints;

/** Fills the `:name` segments of a path. */
export function buildPath(path: string, params: Record<string, string> = {}): string {
  return path.replace(/:([A-Za-z]+)/g, (_, name: string) => {
    const value = params[name];
    if (value === undefined) throw new Error(`Missing path parameter "${name}" for ${path}`);
    return encodeURIComponent(value);
  });
}
