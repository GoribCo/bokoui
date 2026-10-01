import { apiClient, type ApiClient } from "@/lib/api/client";

/**
 * Base of every service. It holds the API client: the browser one by default, or the server one
 * (`new MenuService(await getServerApi())`) when rendering on the server.
 */
export abstract class BaseService {
  constructor(protected readonly client: ApiClient = apiClient) {}
}
