"use client";

import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { menuService } from "@/lib/services";

class OrganizationMenuQuery extends BaseQuery {
  get(organizationId: string) {
    return this.useQuery({
      queryKey: queryKeys.menu(organizationId),
      queryFn: () => menuService.getMenu(organizationId),
    });
  }
}

const organizationMenuQuery = new OrganizationMenuQuery();

/** Menu of one organization; instant when the server prefetched it, fetched on demand after a switch. */
export function useOrganizationMenu(organizationId: string) {
  return organizationMenuQuery.get(organizationId);
}
