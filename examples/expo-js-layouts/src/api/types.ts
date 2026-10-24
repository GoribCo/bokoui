/*
 * The `src/api` folder stands in for the backend: sample data in `data/`, one file of handlers per
 * resource in `endpoints/`, and a route table in `router.ts`. The app reaches it through the in-process
 * transport (`transport.ts`) behind `ApiClient`, exactly as it reaches a real server over HTTP, so
 * replacing the backend means setting `EXPO_PUBLIC_API_BASE_URL` and deleting this folder.
 */

import type { ErrorCode } from "@/lib/contract";

export interface ApiContext {
  method: string;
  /** Values of `:name` segments in the matched path. */
  params: Record<string, string>;
  query: URLSearchParams;
  /** JSON body; `undefined` when the request had none. */
  body: unknown;
  /** Bearer token of the request, `null` when there is none. */
  accessToken: string | null;
}

export interface ApiResult<T = unknown> {
  results: T;
  /** Paging block for lists. */
  meta?: ApiPageMeta;
  status?: number;
}

export interface ApiPageMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ApiHandler = (context: ApiContext) => Promise<ApiResult> | ApiResult;

/** Thrown by handlers; the router turns it into `{ success: false, message, code }` with this status. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code?: ErrorCode,
    /** Name of the offending field for validation errors. */
    readonly field?: string,
  ) {
    super(message);
  }
}
