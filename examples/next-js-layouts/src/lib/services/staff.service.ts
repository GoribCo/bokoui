import type { StaffValues } from "@/lib/schemas/staff";
import { BaseService } from "./base.service";

export interface StaffMember extends StaffValues {
  id: number;
}

export class StaffService extends BaseService {
  async create(values: StaffValues): Promise<StaffMember> {
    return this.client.post<StaffMember>("/staff", values);
  }
}
