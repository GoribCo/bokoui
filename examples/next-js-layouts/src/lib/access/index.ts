import type { Organization, Role } from "@/types";
import { permissionPolicy } from "./policy";
import type { Permission } from "./policy";

export type { Permission } from "./policy";

export function hasRole(roles: readonly Role[], role: Role): boolean {
  return roles.includes(role);
}

/** True when `required` is empty or missing, or when the user holds at least one of its roles. */
export function hasAnyRole(roles: readonly Role[], required?: readonly Role[]): boolean {
  if (!required || required.length === 0) return true;
  return required.some((role) => roles.includes(role));
}

/** True when any of the user's roles grants the permission. */
export function can(
  roles: readonly Role[],
  permission: Permission,
  policy: Record<Permission, readonly Role[]> = permissionPolicy,
): boolean {
  return hasAnyRole(roles, policy[permission]);
}

/** Union of the user's roles within one organization (FR-10.1); empty when not a member. */
export function effectiveRoles(organizations: readonly Organization[], organizationId: string): Role[] {
  const roles = organizations
    .filter((org) => org.id === organizationId)
    .flatMap((org) => org.roles);
  return [...new Set(roles)];
}
