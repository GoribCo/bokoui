import { applyActiveRole, effectiveRoles } from "@/lib/access";
import { permissionsInOrganization, type PermissionId } from "@/lib/authorization";
import { getInitialState } from "@/lib/session/initial-state";
import type { Role } from "@/lib/types";

/**
 * Roles the signed-in user acts with in the active organization (the chosen role, or all), for server-side checks. The active organization
 * comes from the same cookie the client store writes, validated against the user's memberships.
 */
export async function getActiveRoles(): Promise<Role[]> {
  const { session, initialOrganizationId, initialActiveRole } = await getInitialState();
  return session && initialOrganizationId
    ? applyActiveRole(effectiveRoles(session.organizations, initialOrganizationId), initialActiveRole)
    : [];
}

/** Permissions the signed-in user has in the active organization, acting as the chosen role (or all of theirs). */
export async function getActivePermissions(): Promise<PermissionId[]> {
  const { session, initialOrganizationId, initialActiveRole } = await getInitialState();
  return session && initialOrganizationId
    ? permissionsInOrganization(session, initialOrganizationId, { activeRole: initialActiveRole })
    : [];
}
