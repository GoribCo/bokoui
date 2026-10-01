import { endpoints } from "@/lib/contract";
import type { StaffValues } from "@/lib/schemas/staff";
import { BaseService } from "./base.service";

export interface StaffMember extends StaffValues {
  id: number;
}

export class StaffService extends BaseService {
  create(values: StaffValues): Promise<StaffMember> {
    return this.request(endpoints.createStaff, { body: values });
  }
}
