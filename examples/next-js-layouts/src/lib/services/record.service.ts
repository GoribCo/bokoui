import type { ApiClient, PagedResult } from "@/lib/api/client";
import { recordSchema } from "@/lib/schemas";
import type { RecordStatus, SampleRecord } from "@/lib/types";

export interface RecordListParams {
  status?: RecordStatus | "all";
  q?: string;
  page?: number;
  pageSize?: number;
}

export function createRecordService(client: ApiClient) {
  return {
    async list(params: RecordListParams = {}): Promise<PagedResult<SampleRecord>> {
      const page = await client.getPage<unknown>("/records", { ...params });
      return { ...page, items: page.items.map((item) => recordSchema.parse(item)) };
    },
  };
}
