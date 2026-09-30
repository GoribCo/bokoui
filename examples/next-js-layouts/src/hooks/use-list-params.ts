"use client";

import { useQueryStates } from "nuqs";
import { listParamParsers } from "@/lib/query/search-params";

/**
 * Tab, text filter and page in the URL (FR-9.4). Changing the tab or filter resets to page 1.
 * Shareable page state belongs here, not in a Zustand store.
 */
export function useListParams() {
  const [params, setParams] = useQueryStates(listParamParsers, { history: "replace" });

  return {
    ...params,
    setTab: (tab: typeof params.tab) => setParams({ tab, page: 1 }),
    setQuery: (q: string) => setParams({ q: q || null, page: 1 }),
    setPage: (page: number) => setParams({ page }),
  };
}
