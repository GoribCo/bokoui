"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { services } from "@/lib/services";

/** Bottom menu shared by every organization (terms, help, ...). */
export function useCommonMenu() {
  return useQuery({
    queryKey: queryKeys.commonMenu,
    queryFn: () => services.menus.getCommonMenu(),
    staleTime: Infinity,
  });
}
