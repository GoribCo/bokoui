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
  /** Extra headers per request, e.g. the cookies of the incoming request when rendering on the server. */
  headers?: () => HeadersInit | Promise<HeadersInit>;
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
 */
export class ApiClient {
  constructor(private readonly options: ApiClientOptions) {}

  private async execute<T>(path: string, init: RequestInit = {}): Promise<Envelope<T>> {
    const extra = (await this.options.headers?.()) ?? {};
    const response = await fetch(`${this.options.baseUrl}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...extra,
      },
    });
    const text = await response.text();
    const body = (text ? JSON.parse(text) : {}) as Envelope<T>;
    if (!response.ok || body.success === false) {
      throw new ApiError(response.status, body.message ?? response.statusText, body.code);
    }
    return body;
  }

  async get<T>(path: string, params?: QueryParams): Promise<T> {
    return (await this.execute<T>(withQuery(path, params))).results as T;
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
