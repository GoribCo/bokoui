"use client";

import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { MenuService } from "@/lib/services/menu.service";

class CommonMenuQuery extends BaseQuery {
  private readonly service = new MenuService();

  get() {
    return this.useQuery({
      queryKey: queryKeys.commonMenu,
      queryFn: () => this.service.getCommonMenu(),
      staleTime: Infinity,
    });
  }
}

const commonMenuQuery = new CommonMenuQuery();

/** Bottom menu shared by every organization (terms, help, ...). */
export function useCommonMenu() {
  return commonMenuQuery.get();
}
