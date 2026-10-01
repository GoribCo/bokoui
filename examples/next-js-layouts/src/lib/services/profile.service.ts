import { profileSchema } from "@/lib/schemas";
import type { UserProfile } from "@/lib/types";
import { BaseService } from "./base.service";

export class ProfileService extends BaseService {
  async getMyProfile(): Promise<UserProfile> {
    return profileSchema.parse(await this.client.get("/profiles/me"));
  }
}
