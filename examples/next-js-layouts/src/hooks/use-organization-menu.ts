"use client";

import { useQuery } from "@/lib/query/react-query";
import { queryKeys } from "@/lib/query/keys";
import { services } from "@/lib/services";

/** Menu of one organization; instant when the server prefetched it, fetched on demand after a switch. */
export function useOrganizationMenu(organizationId: string) {
  return useQuery({
    queryKey: queryKeys.menu(organizationId),
    queryFn: () => services.menus.getMenu(organizationId),
  });
}
