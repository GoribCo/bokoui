"use client";

import { useQuery } from "@/lib/query/react-query";
import { queryKeys } from "@/lib/query/keys";
import { services } from "@/lib/services";

/** Organizations of the signed-in user. */
export function useOrganizations() {
  return useQuery({ queryKey: queryKeys.organizations, queryFn: () => services.organizations.getOrganizations() });
}
