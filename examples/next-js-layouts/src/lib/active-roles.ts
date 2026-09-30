import { effectiveRoles } from "@/lib/access";
import { getInitialState } from "@/lib/initial-state";
import type { Role } from "@/types";

/**
 * Roles of the signed-in user in the active organization, for server-side checks. The active organization
 * comes from the same cookie the client store writes, validated against the user's memberships.
 */
export async function getActiveRoles(): Promise<Role[]> {
  const { session, initialOrganizationId } = await getInitialState();
  return session && initialOrganizationId ? effectiveRoles(session.organizations, initialOrganizationId) : [];
}
