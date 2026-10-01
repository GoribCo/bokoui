"use client";

import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { RecordService, type RecordListParams } from "@/lib/services/record.service";

class RecordsQuery extends BaseQuery {
  private readonly service = new RecordService();

  list(params: RecordListParams) {
    return this.useQuery({
      queryKey: queryKeys.records(params),
      queryFn: () => this.service.list(params),
      placeholderData: this.keepPreviousData,
    });
  }
}

const recordsQuery = new RecordsQuery();

/** One page of sample records; the previous page stays on screen while the next one loads. */
export function useRecords(params: RecordListParams) {
  return recordsQuery.list(params);
}
