import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { organizationService } from "@/lib/services";
import type { OrganizationType } from "@/lib/types";

class PublicOrganizationsQuery extends BaseQuery {
  list() {
    return this.useQuery({
      queryKey: queryKeys.publicOrganizations,
      queryFn: () => organizationService.listPublicOrganizations(),
      staleTime: 10 * 60 * 1000, // public profiles change rarely
    });
  }

  get(type: OrganizationType, slug: string) {
    return this.useQuery({
      queryKey: queryKeys.publicOrganization(type, slug),
      queryFn: () => organizationService.getPublicOrganization(type, slug),
      staleTime: 10 * 60 * 1000,
    });
  }
}

const publicOrganizationsQuery = new PublicOrganizationsQuery();

/** Every organization with a public profile (no sign-in needed). */
export function usePublicOrganizations() {
  return publicOrganizationsQuery.list();
}

/** One public profile; `data` is `null` when the slug is unknown. */
export function usePublicOrganization(type: OrganizationType, slug: string) {
  return publicOrganizationsQuery.get(type, slug);
}
