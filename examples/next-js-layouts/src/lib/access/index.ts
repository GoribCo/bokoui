import { permissionsForRoles, type PermissionId } from "@/lib/authorization";
import type { Organization, Role } from "@/lib/types";

export type { PermissionId as Permission } from "@/lib/authorization";

export function hasRole(roles: readonly Role[], role: Role): boolean {
  return roles.includes(role);
}

/** True when `required` is empty or missing, or when the user holds at least one of its roles. */
export function hasAnyRole(roles: readonly Role[], required?: readonly Role[]): boolean {
  if (!required || required.length === 0) return true;
  return required.some((role) => roles.includes(role));
}

/** True when the roles grant the permission, decided by the evaluator in `lib/authorization`. */
export function can(roles: readonly Role[], permission: PermissionId): boolean {
  return permissionsForRoles(roles).includes(permission);
}

/** Union of the user's roles within one organization (FR-10.1); empty when not a member. */
export function effectiveRoles(organizations: readonly Organization[], organizationId: string): Role[] {
  const roles = organizations
    .filter((org) => org.id === organizationId)
    .flatMap((org) => org.roles);
  return [...new Set(roles)];
}

/**
 * The roles to act with: just the chosen one when the user holds it in this organization, otherwise all
 * of them. A stale choice (a role from another organization, or one that was revoked) is ignored.
 */
export function applyActiveRole(roles: readonly Role[], activeRole: string | null | undefined): Role[] {
  return activeRole && roles.includes(activeRole) ? [activeRole] : [...roles];
}
