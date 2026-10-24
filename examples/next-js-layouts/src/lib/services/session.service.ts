import { isApiError } from "@/lib/api/errors";
import { endpoints } from "@/lib/contract";
import type { Session } from "@/lib/types";
import { BaseService } from "./base.service";

/** Signed-in state. */
export class SessionService extends BaseService {
  /** The session, or `null` when there is none (the API answers 401). */
  async getSession(): Promise<Session | null> {
    try {
      return await this.request(endpoints.getSession);
    } catch (error) {
      if (isApiError(error, 401)) return null;
      throw error;
    }
  }
}
