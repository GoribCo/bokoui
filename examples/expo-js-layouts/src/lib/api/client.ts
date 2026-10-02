import type { HttpMethod } from "@/lib/contract";
import type { TokenPair } from "@/lib/schemas";
import { ApiError } from "./errors";
import { notifySessionExpired } from "./session-expiry";

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

/** The `{ success, results, meta }` envelope every answer comes in. */
export interface Envelope<T = unknown> {
  success: boolean;
  results?: T;
  meta?: PageMeta;
  message?: string;
  code?: string;
  field?: string;
}

export interface TransportRequest {
  method: HttpMethod;
  /** Path under the API base URL, query string included. */
  path: string;
  body?: unknown;
  /** Bearer token to send; `null` for none. */
  accessToken: string | null;
}

export interface TransportResponse {
  status: number;
  statusText: string;
  body: Envelope;
}

/** How a request reaches the API: real HTTP (`createFetchTransport`) or the in-process sample API. */
export interface ApiTransport {
  send(request: TransportRequest): Promise<TransportResponse>;
}

/** Where the app keeps the token pair (see `lib/auth/token-storage.ts`). */
export interface TokenStore {
  get(): Promise<TokenPair | null>;
  set(tokens: TokenPair): Promise<void>;
  clear(): Promise<void>;
}

export interface ApiClientOptions {
  transport: ApiTransport;
  tokens: TokenStore;
}

/** Real HTTP: `baseUrl` is the full URL of the server, e.g. `https://api.example.com/v1`. */
export function createFetchTransport(baseUrl: string): ApiTransport {
  return {
    async send({ method, path, body, accessToken }) {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const text = await response.text();
      let parsed: Envelope = { success: response.ok };
      try {
        parsed = text ? (JSON.parse(text) as Envelope) : { success: response.ok };
      } catch {
        parsed = { success: false, message: response.statusText };
      }
      return { status: response.status, statusText: response.statusText, body: parsed };
    },
  };
}

/** Paths that never trigger a refresh: they are how a session starts or ends. */
const AUTH_PATH = /^\/auth\//;

function withQuery(path: string, params?: QueryParams): string {
  if (!params) return path;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value !== undefined) search.set(key, String(value));
  const text = search.toString();
  return text ? `${path}?${text}` : path;
}

/**
 * The one place that talks to the API. Services call it and never use `fetch` themselves; hooks call
 * services and components call hooks. It adds the bearer token, unwraps the envelope, turns failures into
 * `ApiError`, and on a 401 refreshes the token pair once and retries the request.
 */
export class ApiClient {
  private refreshing: Promise<boolean> | undefined;

  constructor(private readonly options: ApiClientOptions) {}

  private async send(method: HttpMethod, path: string, body?: unknown): Promise<TransportResponse> {
    const tokens = await this.options.tokens.get();
    return this.options.transport.send({ method, path, body, accessToken: tokens?.accessToken ?? null });
  }

  /** Swaps the refresh token for a new pair. One refresh at a time; a failure ends the session. */
  private refreshSession(): Promise<boolean> {
    this.refreshing ??= (async () => {
      const tokens = await this.options.tokens.get();
      if (!tokens) return false;
      try {
        const { status, body } = await this.options.transport.send({
          method: "POST",
          path: "/auth/refresh",
          body: { refreshToken: tokens.refreshToken },
          accessToken: null,
        });
        if (status < 200 || status >= 300 || body.success === false || !body.results) {
          await this.options.tokens.clear();
          return false;
        }
        await this.options.tokens.set(body.results as TokenPair);
        return true;
      } catch {
        return false;
      }
    })().finally(() => {
      this.refreshing = undefined;
    });
    return this.refreshing;
  }

  private async execute<T>(method: HttpMethod, path: string, payload?: unknown): Promise<Envelope<T>> {
    let response = await this.send(method, path, payload);

    // Expired access token: refresh once and retry.
    if (response.status === 401 && !AUTH_PATH.test(path)) {
      if (await this.refreshSession()) response = await this.send(method, path, payload);
      if (response.status === 401) {
        await this.options.tokens.clear();
        notifySessionExpired();
      }
    }

    const { status, statusText, body } = response;
    if (status < 200 || status >= 300 || body.success === false) {
      throw new ApiError(status, body.message ?? statusText, body.code, body.field);
    }
    return body as Envelope<T>;
  }

  /** True when a token pair is stored: a session may exist. Lets public screens skip calls that would only answer 401. */
  async hasTokens(): Promise<boolean> {
    return (await this.options.tokens.get()) !== null;
  }

  /** Stores the token pair of a new session. */
  setTokens(tokens: TokenPair): Promise<void> {
    return this.options.tokens.set(tokens);
  }

  /** Forgets the token pair (sign-out or expiry). */
  clearTokens(): Promise<void> {
    return this.options.tokens.clear();
  }

  async get<T>(path: string, params?: QueryParams): Promise<T> {
    return (await this.execute<T>("GET", withQuery(path, params))).results as T;
  }

  /** GET a list that comes with a `meta` paging block. */
  async getPage<T>(path: string, params?: QueryParams): Promise<PagedResult<T>> {
    const body = await this.execute<T[]>("GET", withQuery(path, params));
    const items = body.results ?? [];
    return { items, meta: body.meta ?? { total: items.length, page: 1, pageSize: items.length, totalPages: 1 } };
  }

  async post<T>(path: string, payload?: unknown): Promise<T> {
    return (await this.execute<T>("POST", path, payload)).results as T;
  }

  async put<T>(path: string, payload?: unknown): Promise<T> {
    return (await this.execute<T>("PUT", path, payload)).results as T;
  }

  async patch<T>(path: string, payload?: unknown): Promise<T> {
    return (await this.execute<T>("PATCH", path, payload)).results as T;
  }

  async delete<T>(path: string): Promise<T> {
    return (await this.execute<T>("DELETE", path)).results as T;
  }
}
