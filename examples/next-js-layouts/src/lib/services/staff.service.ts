import type { ApiClient } from "@/lib/api/client";
import type { StaffValues } from "@/lib/schemas/staff";

export interface StaffMember extends StaffValues {
  id: number;
}

export function createStaffService(client: ApiClient) {
  return {
    async create(values: StaffValues): Promise<StaffMember> {
      return client.post<StaffMember>("/staff", values);
    },
  };
}
