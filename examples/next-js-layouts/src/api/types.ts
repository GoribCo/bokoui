/*
 * The `src/api` folder stands in for the backend: sample data in `data/`, one file of handlers per
 * resource in `endpoints/`, and a route table in `router.ts`. The app talks to it over HTTP through
 * `app/api/v1/[...path]/route.ts`, exactly as it will talk to the real server, so replacing the
 * backend means changing `NEXT_PUBLIC_API_BASE_URL` and deleting this folder.
 */

import type { ErrorCode } from "@/lib/contract";

export interface ApiContext {
  method: string;
  /** Values of `:name` segments in the matched path. */
  params: Record<string, string>;
  query: URLSearchParams;
  /** Parsed JSON body; `undefined` when the request had none. */
  body: unknown;
  cookies: Record<string, string>;
}

/** A cookie a handler asks the router to set; `maxAge: 0` clears it. Always httpOnly, sameSite lax. */
export interface ApiCookie {
  name: string;
  value: string;
  maxAge: number;
}

export interface ApiResult<T = unknown> {
  results: T;
  cookies?: ApiCookie[];
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
