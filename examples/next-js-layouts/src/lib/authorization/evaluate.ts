import { getApplicableAssignments, getUserMemberships, isCurrentlyActive, isValidContext, scopeApplies } from "./assignments";
import { permissionCatalog, personalPermissions, type PermissionId } from "./permissions";
import type { AuthorizationEnvironment, AuthorizationUser, WorkspaceContext } from "./types";

const kindOf = (permission: string) => (permission in permissionCatalog ? permissionCatalog[permission as PermissionId].scopeKind : undefined);

/**
 * Every permission the user holds in `context`. Fails closed: an invalid context, a bad clock, an expired or
 * unknown assignment all give nothing. A deny override always wins over an allow. Pure: same input, same
 * answer, no I/O. This is for the interface only; the API must enforce access again.
 */
export function getEffectivePermissions(user: AuthorizationUser, context: WorkspaceContext, env: AuthorizationEnvironment): PermissionId[] {
  if (!Number.isFinite(env.now) || !isValidContext(user, context, env)) return [];

  const allowed = new Set<string>(context.kind === "personal" ? personalPermissions : []);
  const assignments =
    context.kind === "platform"
      ? user.platformAssignments.filter(
          (assignment) => assignment.userId === user.id && assignment.scope.kind === "platform" && isCurrentlyActive(assignment, env.now),
        )
      : getApplicableAssignments(user, context, env);

  for (const assignment of assignments) {
    const role = env.roles.find((candidate) => candidate.id === assignment.roleId);
    for (const permission of role?.allowedPermissions ?? []) {
      if (kindOf(permission) === context.kind) allowed.add(permission);
    }
  }

  const memberships = getUserMemberships(user, env);
  const denied = new Set<string>();
  for (const override of user.overrides) {
    if (
      override.userId !== user.id ||
      !isCurrentlyActive(override, env.now) ||
      !scopeApplies(override.scope, context) ||
      kindOf(override.permissionId) !== context.kind
    ) {
      continue;
    }
    if (override.scope.kind === "organization" || override.scope.kind === "branch") {
      const { organizationId } = override.scope;
      if (!memberships.some((membership) => membership.id === override.membershipId && membership.organizationId === organizationId)) continue;
    }
    if (override.effect === "deny") denied.add(override.permissionId);
    else allowed.add(override.permissionId);
  }

  return [...allowed].filter((permission): permission is PermissionId => !denied.has(permission) && kindOf(permission) !== undefined).sort();
}

export function hasPermission(user: AuthorizationUser, permission: PermissionId, context: WorkspaceContext, env: AuthorizationEnvironment) {
  return getEffectivePermissions(user, context, env).includes(permission);
}

export function hasAnyPermission(user: AuthorizationUser, permissions: readonly PermissionId[], context: WorkspaceContext, env: AuthorizationEnvironment) {
  const effective = getEffectivePermissions(user, context, env);
  return permissions.some((permission) => effective.includes(permission));
}

/** Empty requirements are not a grant: asking for nothing is `false`, never `true`. */
export function hasAllPermissions(user: AuthorizationUser, permissions: readonly PermissionId[], context: WorkspaceContext, env: AuthorizationEnvironment) {
  const effective = getEffectivePermissions(user, context, env);
  return permissions.length > 0 && permissions.every((permission) => effective.includes(permission));
}

export function canAccessWorkspace(user: AuthorizationUser, context: WorkspaceContext, env: AuthorizationEnvironment) {
  return getEffectivePermissions(user, context, env).length > 0;
}
