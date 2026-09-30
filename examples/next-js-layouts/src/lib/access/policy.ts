import type { Role } from "@/lib/types";

/** Named permissions checked with `can`; add one per protected capability. */
export type Permission = "admin.access" | "reports.view";

/** Which roles grant each permission. Replace with data from the API when it exists. */
export const permissionPolicy: Record<Permission, readonly Role[]> = {
  "admin.access": ["admin", "auditor"],
  "reports.view": ["admin", "manager", "doctor"],
};
