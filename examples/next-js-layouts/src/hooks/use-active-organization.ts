"use client";

import { useOrganizationStore } from "@/providers/organization-store-provider";
import { useSession } from "@/providers/session-provider";
import { organizationSelectors } from "@/stores/organization-store";
import type { Organization, Role } from "@/types";

export interface ActiveOrganization {
  organization: Organization;
  /** Effective roles (union) in the active organization. */
  roles: Role[];
  organizations: Organization[];
  setActiveOrganization: (organizationId: string) => void;
}

/** The one typed entry point to the organization context (FR-3.5). */
export function useActiveOrganization(): ActiveOrganization {
  const session = useSession();
  const activeId = useOrganizationStore(organizationSelectors.activeOrganizationId);
  const setActiveOrganization = useOrganizationStore(organizationSelectors.setActiveOrganization);

  const organization =
    session.organizations.find((org) => org.id === activeId) ??
    session.organizations.find((org) => org.id === session.defaultOrganizationId) ??
    session.organizations[0];
  if (!organization) throw new Error("The session has no organizations");

  return {
    organization,
    roles: session.rolesByOrganization[organization.id] ?? [],
    organizations: session.organizations,
    setActiveOrganization,
  };
}
