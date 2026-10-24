import { MIN_SEARCH_LENGTH, type RemoteSearchScope } from "@/lib/config/search";
import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { searchService } from "@/lib/services";

class SearchQuery extends BaseQuery {
  results(scope: RemoteSearchScope, q: string, enabled: boolean) {
    return this.useQuery({
      queryKey: queryKeys.search(scope, q),
      queryFn: () => searchService.search(scope, q),
      enabled: enabled && q.length >= MIN_SEARCH_LENGTH,
      placeholderData: this.keepPreviousData,
      staleTime: 30 * 1000,
    });
  }
}

const searchQuery = new SearchQuery();

/** Hits in one content area. Nothing is requested while `enabled` is false or `q` is too short. */
export function useSearch(scope: RemoteSearchScope, q: string, enabled = true) {
  return searchQuery.results(scope, q, enabled);
}
