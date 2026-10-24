import { useMemo } from "react";
import { permissionsInOrganization, type PermissionId } from "@/lib/authorization";
import { useSession } from "@/providers/session-provider";
import { applyActiveRole } from "@/lib/access";
import { resolveActiveOrganizationId } from "@/lib/organization/active-organization";
import { organizationSelectors, roleSelectors, useOrganizationStore, useRoleStore } from "@/lib/stores";
import type { Organization, Role } from "@/lib/types";

export interface ActiveOrganization {
  organization: Organization;
  /** Roles the user acts with: the chosen role, or all of theirs in the active organization. */
  roles: Role[];
  /** Every role the user holds in the active organization. */
  allRoles: Role[];
  /** What the roles above grant in the active organization (see `lib/authorization`). */
  permissions: PermissionId[];
  /** The role chosen to act as, or `null` for all roles. Only set when the user holds it here. */
  activeRole: Role | null;
  setActiveRole: (role: Role | null) => void;
  organizations: Organization[];
  setActiveOrganization: (organizationId: string) => void;
}

/** The one typed entry point to the organization context (FR-3.5). */
export function useActiveOrganization(): ActiveOrganization {
  const session = useSession();
  const activeId = useOrganizationStore(organizationSelectors.activeOrganizationId);
  const setOrganization = useOrganizationStore(organizationSelectors.setActiveOrganization);
  const chosenRole = useRoleStore(roleSelectors.activeRole);
  const setActiveRole = useRoleStore(roleSelectors.setActiveRole);

  // A remembered id that no longer matches a membership falls back to the session default.
  const organization = session.organizations.find(
    (org) => org.id === resolveActiveOrganizationId(session.organizations, activeId ?? undefined, session.defaultOrganizationId),
  );
  if (!organization) throw new Error("The session has no organizations");

  const allRoles = session.rolesByOrganization[organization.id] ?? [];
  const roles = applyActiveRole(allRoles, chosenRole);
  const permissions = useMemo(
    () => permissionsInOrganization(session, organization.id, { activeRole: chosenRole }),
    [session, organization.id, chosenRole],
  );

  return {
    organization,
    roles,
    allRoles,
    permissions,
    activeRole: roles.length === 1 && allRoles.length > 1 ? roles[0] : null,
    setActiveRole,
    organizations: session.organizations,
    // A role chosen in one organization says nothing about another: switching starts from all roles again.
    setActiveOrganization: (organizationId) => {
      setOrganization(organizationId);
      setActiveRole(null);
    },
  };
}
