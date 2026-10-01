import type { ApiClient } from "@/lib/api/client";
import { profileSchema } from "@/lib/schemas";
import type { UserProfile } from "@/lib/types";

export function createProfileService(client: ApiClient) {
  return {
    async getMyProfile(): Promise<UserProfile> {
      return profileSchema.parse(await client.get("/profiles/me"));
    },
  };
}
