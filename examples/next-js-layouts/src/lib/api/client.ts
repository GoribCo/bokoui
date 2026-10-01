import { ApiError } from "./errors";

export interface PageMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PagedResult<T> {
  items: T[];
  meta: PageMeta;
}

export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface ApiClientOptions {
  /** Prefix of every request: a path in the browser (`/api/v1`) or a full URL for a remote server. */
  baseUrl: string;
}

/** Next.js data-cache settings for a request that may be shared between visitors (public data). */
export interface CacheOptions {
  revalidate: number;
  tags?: string[];
}

interface Envelope<T> {
  success: boolean;
  results?: T;
  meta?: PageMeta;
  message?: string;
  code?: string;
}

function withQuery(path: string, params?: QueryParams): string {
  if (!params) return path;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value !== undefined) search.set(key, String(value));
  const text = search.toString();
  return text ? `${path}?${text}` : path;
}

/**
 * The one place that talks HTTP. Services call it and never use `fetch` themselves; hooks call services
 * and components call hooks. It unwraps the `{ success, results, meta }` envelope and turns failures into
 * `ApiError`.
 *
 * It works in the browser and on the server with the same instance. In the browser the relative base URL
 * and the session cookie are handled by `fetch`. On the server it builds the absolute URL from the
 * incoming request and forwards the visitor's cookies. A request with `cache` options is public and
 * shared, so it never carries cookies.
 */
export class ApiClient {
  constructor(private readonly options: ApiClientOptions) {}

  /** URL prefix and cookie header for the current environment. */
  private async target(shared: boolean): Promise<{ baseUrl: string; cookie: string }> {
    if (typeof window !== "undefined") return { baseUrl: this.options.baseUrl, cookie: "" };

    // Server only: loaded here so the browser bundle never needs it.
    const { cookies, headers } = await import("next/headers");
    let baseUrl = this.options.baseUrl;
    if (!/^https?:\/\//.test(baseUrl)) {
      // The sample backend runs inside this app: call it on the host that received the request.
      const incoming = await headers();
      const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:3000";
      const protocol = incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
      baseUrl = `${protocol}://${host}${baseUrl}`;
    }
    return { baseUrl, cookie: shared ? "" : (await cookies()).toString() };
  }

  private async execute<T>(path: string, init: RequestInit = {}, cache?: CacheOptions): Promise<Envelope<T>> {
    const { baseUrl, cookie } = await this.target(Boolean(cache));
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      ...(cache ? { next: { revalidate: cache.revalidate, tags: cache.tags } } : { cache: "no-store" as const }),
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...(cookie ? { cookie } : {}),
      },
    });
    const text = await response.text();
    const body = (text ? JSON.parse(text) : {}) as Envelope<T>;
    if (!response.ok || body.success === false) {
      throw new ApiError(response.status, body.message ?? response.statusText, body.code);
    }
    return body;
  }

  /** GET. With `cache` the answer is public and kept by the Next.js data cache (never sent cookies). */
  async get<T>(path: string, params?: QueryParams, cache?: CacheOptions): Promise<T> {
    return (await this.execute<T>(withQuery(path, params), {}, cache)).results as T;
  }

  /** GET a list that comes with a `meta` paging block. */
  async getPage<T>(path: string, params?: QueryParams): Promise<PagedResult<T>> {
    const body = await this.execute<T[]>(withQuery(path, params));
    const items = body.results ?? [];
    return { items, meta: body.meta ?? { total: items.length, page: 1, pageSize: items.length, totalPages: 1 } };
  }

  async post<T>(path: string, payload?: unknown): Promise<T> {
    const body = payload === undefined ? undefined : JSON.stringify(payload);
    return (await this.execute<T>(path, { method: "POST", body })).results as T;
  }

  async put<T>(path: string, payload?: unknown): Promise<T> {
    const body = payload === undefined ? undefined : JSON.stringify(payload);
    return (await this.execute<T>(path, { method: "PUT", body })).results as T;
  }

  async patch<T>(path: string, payload?: unknown): Promise<T> {
    const body = payload === undefined ? undefined : JSON.stringify(payload);
    return (await this.execute<T>(path, { method: "PATCH", body })).results as T;
  }

  async delete<T>(path: string): Promise<T> {
    return (await this.execute<T>(path, { method: "DELETE" })).results as T;
  }
}

/** Where the API lives. Point `NEXT_PUBLIC_API_BASE_URL` at the real server (e.g. `https://api.example.com/v1`). */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

/** Client for the browser: same-origin requests carry the session cookie automatically. */
export const apiClient = new ApiClient({ baseUrl: API_BASE_URL });
