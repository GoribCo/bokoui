"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { services } from "@/lib/services";

export function useProfile() {
  return useQuery({ queryKey: queryKeys.profile, queryFn: () => services.profiles.getMyProfile() });
}
