import { organizationTypes } from "@/lib/config/organization-types";
import type { Organization, OrganizationType, PublicOrganization } from "@/lib/types";

export const organizationTypeKeys = Object.keys(organizationTypes) as [OrganizationType, ...OrganizationType[]];

/** Route segments of the public profile screens, e.g. for the sign-in guard. */
export const organizationSegments: string[] = organizationTypeKeys.map((key) => organizationTypes[key].segment);

export function organizationTypeFromSegment(segment: string): OrganizationType | undefined {
  return organizationTypeKeys.find((key) => organizationTypes[key].segment === segment);
}

/** Public profile path of an organization: `/{segment}/{slug}`. */
export function publicOrganizationPath(org: Pick<Organization | PublicOrganization, "type" | "slug">): string {
  return `/${organizationTypes[org.type].segment}/${org.slug}`;
}
