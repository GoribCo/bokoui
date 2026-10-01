"use client";

import { BaseQuery } from "@/lib/query/base-query";
import { StaffService } from "@/lib/services/staff.service";
import type { StaffValues } from "@/lib/schemas/staff";

class StaffMutation extends BaseQuery {
  private readonly service = new StaffService();

  create() {
    return this.useMutation({ mutationFn: (values: StaffValues) => this.service.create(values) });
  }
}

const staffMutation = new StaffMutation();

export function useCreateStaff() {
  return staffMutation.create();
}
