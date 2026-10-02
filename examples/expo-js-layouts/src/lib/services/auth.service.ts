import { endpoints } from "@/lib/contract";
import type { SignInValues } from "@/lib/schemas";
import { BaseService } from "./base.service";

export interface SignedInUser {
  id: string;
  name: string;
  email: string;
}

/** Starts and ends the session. The token pair is kept by the client (secure storage); callers never see it. */
export class AuthService extends BaseService {
  async login(values: SignInValues): Promise<SignedInUser> {
    const { tokens, ...user } = await this.request(endpoints.login, { body: values });
    await this.client.setTokens(tokens);
    return user;
  }

  /** Tells the API (best effort) and always forgets the tokens. */
  async logout(): Promise<void> {
    try {
      await this.request(endpoints.logout, { body: {} });
    } finally {
      await this.client.clearTokens();
    }
  }
}
