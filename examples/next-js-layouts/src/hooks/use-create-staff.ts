"use client";

import { BaseQuery } from "@/lib/query/base-query";
import { staffService } from "@/lib/services";
import type { StaffValues } from "@/lib/schemas/staff";

class StaffMutation extends BaseQuery {
  /** Cache effect: none. The sample endpoint stores nothing and no list shows staff; a real one would invalidate that list. */
  create() {
    return this.useMutation({ mutationFn: (values: StaffValues) => staffService.create(values) });
  }
}

const staffMutation = new StaffMutation();

export function useCreateStaff() {
  return staffMutation.create();
}
