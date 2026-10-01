import type { PagedResult } from "@/lib/api/client";
import { endpoints } from "@/lib/contract";
import type { RecordStatus, SampleRecord } from "@/lib/types";
import { BaseService } from "./base.service";

export interface RecordListParams {
  status?: RecordStatus | "all";
  q?: string;
  page?: number;
  pageSize?: number;
}

export class RecordService extends BaseService {
  list(params: RecordListParams = {}): Promise<PagedResult<SampleRecord>> {
    return this.requestPage(endpoints.listRecords, { query: { ...params } });
  }
}
