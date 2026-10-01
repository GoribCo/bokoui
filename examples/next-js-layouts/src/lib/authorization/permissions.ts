import type { ScopeKind } from "./types";

/**
 * Every permission the app checks, with the scope it belongs to. A permission only counts in a context of
 * its own kind. The ids here are samples: replace them with your product's (and keep one id per route and
 * per menu entry that needs protecting).
 */
export const permissionCatalog = {
  "personal.profile.manage": { scopeKind: "personal" },
  "organization.dashboard.view": { scopeKind: "organization" },
  "organization.reports.view": { scopeKind: "organization" },
  "organization.staff.manage": { scopeKind: "organization" },
  "organization.settings.manage": { scopeKind: "organization" },
  "organization.access.view": { scopeKind: "organization" },
} as const satisfies Record<string, { scopeKind: ScopeKind }>;

export type PermissionId = keyof typeof permissionCatalog;

/** Granted to everyone in their own personal context, with no assignment needed. */
export const personalPermissions: readonly PermissionId[] = ["personal.profile.manage"];

export const isPermissionId = (value: string): value is PermissionId => value in permissionCatalog;
