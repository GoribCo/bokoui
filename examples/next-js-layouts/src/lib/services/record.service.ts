import type { PagedResult } from "@/lib/api/client";
import { recordSchema } from "@/lib/schemas";
import type { RecordStatus, SampleRecord } from "@/lib/types";
import { BaseService } from "./base.service";

export interface RecordListParams {
  status?: RecordStatus | "all";
  q?: string;
  page?: number;
  pageSize?: number;
}

export class RecordService extends BaseService {
  async list(params: RecordListParams = {}): Promise<PagedResult<SampleRecord>> {
    const page = await this.client.getPage<unknown>("/records", { ...params });
    return { ...page, items: page.items.map((item) => recordSchema.parse(item)) };
  }
}
