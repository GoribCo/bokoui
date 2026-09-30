"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchMenu, fetchOrganizations } from "@/services/actions";

/** Menu of one organization; instant when the server prefetched it, fetched on demand after a switch. */
export function useMenuQuery(organizationId: string) {
  return useQuery({
    queryKey: queryKeys.menu(organizationId),
    queryFn: () => fetchMenu(organizationId),
  });
}

export function useOrganizationsQuery() {
  return useQuery({
    queryKey: queryKeys.organizations,
    queryFn: fetchOrganizations,
  });
}
