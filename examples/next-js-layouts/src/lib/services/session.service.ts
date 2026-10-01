import type { ApiClient } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";
import { sessionSchema } from "@/lib/schemas";
import type { Session } from "@/lib/types";

/** Signed-in state. `null` when there is no session (the API answers 401). */
export function createSessionService(client: ApiClient) {
  return {
    async getSession(): Promise<Session | null> {
      try {
        return sessionSchema.parse(await client.get("/session"));
      } catch (error) {
        if (isApiError(error, 401)) return null;
        throw error;
      }
    },
  };
}
