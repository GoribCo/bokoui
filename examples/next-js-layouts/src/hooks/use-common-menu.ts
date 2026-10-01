"use client";

import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { menuService } from "@/lib/services";

class CommonMenuQuery extends BaseQuery {
  get() {
    return this.useQuery({
      queryKey: queryKeys.commonMenu,
      queryFn: () => menuService.getCommonMenu(),
      staleTime: Infinity,
    });
  }
}

const commonMenuQuery = new CommonMenuQuery();

/** Bottom menu shared by every organization (terms, help, ...). */
export function useCommonMenu() {
  return commonMenuQuery.get();
}
