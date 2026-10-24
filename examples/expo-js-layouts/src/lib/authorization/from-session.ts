import { roleTemplates } from "./role-templates";
import { getEffectivePermissions } from "./evaluate";
import type { PermissionId } from "./permissions";
import type { Assignment, AuthorizationEnvironment, AuthorizationUser, Membership } from "./types";

const ALWAYS = { status: "active", validFrom: "2000-01-01T00:00:00Z", validUntil: null } as const;

interface SessionLike {
  user: { id: string };
  organizations: readonly { id: string; roles: readonly string[] }[];
}

/**
 * The evaluator's inputs for a signed-in session: one membership per organization and one assignment per
 * role the API reports there, valid from the start of time with no end. When the API starts reporting
 * validity windows, branches or overrides, map them here and nothing else changes.
 */
export function authorizationFromSession(session: SessionLike, now: number, onlyRole?: string | null) {
  const memberships: Membership[] = session.organizations.map((org) => ({
    id: `membership:${org.id}`,
    userId: session.user.id,
    organizationId: org.id,
    ...ALWAYS,
  }));
  const assignments: Assignment[] = session.organizations.flatMap((org) =>
    org.roles
      .filter((role) => !onlyRole || role === onlyRole)
      .map((role) => ({
        id: `assignment:${org.id}:${role}`,
        userId: session.user.id,
        membershipId: `membership:${org.id}`,
        roleId: role,
        scope: { kind: "organization", organizationId: org.id } as const,
        ...ALWAYS,
      })),
  );
  const user: AuthorizationUser = {
    id: session.user.id,
    personId: session.user.id,
    memberships,
    assignments,
    platformAssignments: [],
    overrides: [],
  };
  const env: AuthorizationEnvironment = {
    now,
    roles: roleTemplates,
    organizations: session.organizations.map((org) => ({ id: org.id, status: "active" })),
    branches: [],
  };
  return { user, env };
}

/** Permissions the signed-in user has in one organization, optionally acting as just one of their roles. */
export function permissionsInOrganization(
  session: SessionLike,
  organizationId: string,
  options: { now?: number; activeRole?: string | null } = {},
): PermissionId[] {
  const { user, env } = authorizationFromSession(session, options.now ?? Date.now(), options.activeRole);
  return getEffectivePermissions(user, { kind: "organization", organizationId }, env);
}

/** Permissions a set of roles grants in an organization, for code that has roles but no session. */
export function permissionsForRoles(roles: readonly string[], now = Date.now()): PermissionId[] {
  return permissionsInOrganization({ user: { id: "roles" }, organizations: [{ id: "org", roles }] }, "org", { now });
}
