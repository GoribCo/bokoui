import { endpoints } from "@/lib/contract";
import type { RemoteSearchScope } from "@/lib/config/search";
import type { SearchResult } from "@/lib/schemas";
import { BaseService } from "./base.service";

export class SearchService extends BaseService {
  /** Hits for `q` in one content area. */
  search(scope: RemoteSearchScope, q: string): Promise<SearchResult[]> {
    return this.request(endpoints.search, { query: { scope, q } });
  }
}
