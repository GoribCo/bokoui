"use client";

import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { organizationService } from "@/lib/services";

class OrganizationsQuery extends BaseQuery {
  list() {
    return this.useQuery({ queryKey: queryKeys.organizations, queryFn: () => organizationService.getOrganizations() });
  }
}

const organizationsQuery = new OrganizationsQuery();

/** Organizations of the signed-in user. */
export function useOrganizations() {
  return organizationsQuery.list();
}
