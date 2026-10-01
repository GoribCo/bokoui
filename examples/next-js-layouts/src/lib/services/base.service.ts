import type { z } from "zod";
import { apiClient, type ApiClient, type CacheOptions, type PagedResult, type QueryParams } from "@/lib/api/client";
import { buildPath, type Endpoint } from "@/lib/contract";

export interface RequestOptions {
  /** Values for the `:name` segments of the path. */
  params?: Record<string, string>;
  query?: QueryParams;
  /** Request body for POST, PUT and PATCH. */
  body?: unknown;
  /** Makes a GET public and cached by the Next.js data cache (never sent cookies). */
  cache?: CacheOptions;
}

/**
 * Base of every service: holds the API client and calls endpoints of the contract (`lib/contract`), so the
 * path, the method and the validation of the answer come from one place. Use the shared instances from
 * `lib/services` instead of creating new ones.
 */
export abstract class BaseService {
  constructor(protected readonly client: ApiClient = apiClient) {}

  /** Calls `endpoint` and returns its validated `results`. */
  protected async request<TResponse extends z.ZodType>(
    endpoint: Endpoint<TResponse>,
    { params, query, body, cache }: RequestOptions = {},
  ): Promise<z.output<TResponse>> {
    const path = buildPath(endpoint.path, params);
    let raw: unknown;
    switch (endpoint.method) {
      case "GET":
        raw = await this.client.get(path, query, cache);
        break;
      case "POST":
        raw = await this.client.post(path, body);
        break;
      case "PUT":
        raw = await this.client.put(path, body);
        break;
      case "PATCH":
        raw = await this.client.patch(path, body);
        break;
      case "DELETE":
        raw = await this.client.delete(path);
        break;
    }
    return endpoint.response.parse(raw);
  }

  /** Calls a paged GET endpoint and returns its validated items with the `meta` block. */
  protected async requestPage<TResponse extends z.ZodType>(
    endpoint: Endpoint<TResponse>,
    { params, query }: Pick<RequestOptions, "params" | "query"> = {},
  ): Promise<PagedResult<z.output<TResponse>>> {
    const page = await this.client.getPage<unknown>(buildPath(endpoint.path, params), query);
    return { ...page, items: page.items.map((item) => endpoint.response.parse(item)) };
  }
}
