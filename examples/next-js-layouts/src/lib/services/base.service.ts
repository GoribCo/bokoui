import { apiClient, type ApiClient } from "@/lib/api/client";

/** Base of every service: holds the API client. Use the shared instances from `lib/services` instead of creating new ones. */
export abstract class BaseService {
  constructor(protected readonly client: ApiClient = apiClient) {}
}
