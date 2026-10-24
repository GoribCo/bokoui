"use client";

import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { profileService } from "@/lib/services";

class ProfileQuery extends BaseQuery {
  get() {
    return this.useQuery({ queryKey: queryKeys.profile, queryFn: () => profileService.getMyProfile() });
  }
}

const profileQuery = new ProfileQuery();

export function useProfile() {
  return profileQuery.get();
}
