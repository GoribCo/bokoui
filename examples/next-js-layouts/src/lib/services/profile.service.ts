import { endpoints } from "@/lib/contract";
import type { UserProfile } from "@/lib/types";
import { BaseService } from "./base.service";

export class ProfileService extends BaseService {
  getMyProfile(): Promise<UserProfile> {
    return this.request(endpoints.getMyProfile);
  }
}
