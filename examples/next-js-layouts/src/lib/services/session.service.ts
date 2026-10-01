import { isApiError } from "@/lib/api/errors";
import { sessionSchema } from "@/lib/schemas";
import type { Session } from "@/lib/types";
import { BaseService } from "./base.service";

/** Signed-in state. */
export class SessionService extends BaseService {
  /** The session, or `null` when there is none (the API answers 401). */
  async getSession(): Promise<Session | null> {
    try {
      return sessionSchema.parse(await this.client.get("/session"));
    } catch (error) {
      if (isApiError(error, 401)) return null;
      throw error;
    }
  }
}
