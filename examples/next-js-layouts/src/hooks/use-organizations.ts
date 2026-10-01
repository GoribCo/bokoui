"use client";

import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { OrganizationService } from "@/lib/services/organization.service";

class OrganizationsQuery extends BaseQuery {
  private readonly service = new OrganizationService();

  list() {
    return this.useQuery({ queryKey: queryKeys.organizations, queryFn: () => this.service.getOrganizations() });
  }
}

const organizationsQuery = new OrganizationsQuery();

/** Organizations of the signed-in user. */
export function useOrganizations() {
  return organizationsQuery.list();
}
