import type { ApiClient } from "@/lib/api/client";

/** Base of every service: holds the API client, so the same class runs in the browser and on the server. */
export abstract class BaseService {
  constructor(protected readonly client: ApiClient) {}
}
