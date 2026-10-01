"use client";

import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { ProfileService } from "@/lib/services/profile.service";

class ProfileQuery extends BaseQuery {
  private readonly service = new ProfileService();

  get() {
    return this.useQuery({ queryKey: queryKeys.profile, queryFn: () => this.service.getMyProfile() });
  }
}

const profileQuery = new ProfileQuery();

export function useProfile() {
  return profileQuery.get();
}
