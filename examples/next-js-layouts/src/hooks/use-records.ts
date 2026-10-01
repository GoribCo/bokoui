"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { services } from "@/lib/services";
import type { RecordListParams } from "@/lib/services/record.service";

/** One page of sample records; the previous page stays on screen while the next one loads. */
export function useRecords(params: RecordListParams) {
  return useQuery({
    queryKey: queryKeys.records(params),
    queryFn: () => services.records.list(params),
    placeholderData: keepPreviousData,
  });
}
