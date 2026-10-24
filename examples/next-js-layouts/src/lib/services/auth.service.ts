import { endpoints } from "@/lib/contract";
import type { SignInValues } from "@/lib/schemas";
import { BaseService } from "./base.service";

export interface SignedInUser {
  id: string;
  name: string;
  email: string;
}

/** Starts and ends the session. The API sets and clears the httpOnly token cookies; nothing here sees a token. */
export class AuthService extends BaseService {
  login(values: SignInValues): Promise<SignedInUser> {
    return this.request(endpoints.login, { body: values });
  }

  async logout(): Promise<void> {
    await this.request(endpoints.logout);
  }
}
