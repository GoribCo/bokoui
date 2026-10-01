"use client";

import { useMutation } from "@tanstack/react-query";
import { services } from "@/lib/services";
import type { StaffValues } from "@/lib/schemas/staff";

export function useCreateStaff() {
  return useMutation({ mutationFn: (values: StaffValues) => services.staff.create(values) });
}
