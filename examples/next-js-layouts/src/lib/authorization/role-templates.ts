import type { PermissionId } from "./permissions";
import type { RoleDefinition } from "./types";

/**
 * What each role grants. Roles are what the API reports per organization; permissions are what the code
 * checks. Load these from your API when roles are editable at runtime.
 */
export const roleTemplates: (RoleDefinition & { allowedPermissions: readonly PermissionId[] })[] = [
  {
    id: "admin",
    allowedPermissions: [
      "organization.dashboard.view",
      "organization.reports.view",
      "organization.staff.manage",
      "organization.settings.manage",
      "organization.access.view",
    ],
  },
  { id: "doctor", allowedPermissions: ["organization.dashboard.view", "organization.reports.view"] },
  { id: "manager", allowedPermissions: ["organization.dashboard.view", "organization.reports.view", "organization.staff.manage"] },
  { id: "pharmacist", allowedPermissions: ["organization.dashboard.view"] },
  { id: "auditor", allowedPermissions: ["organization.dashboard.view", "organization.reports.view", "organization.access.view"] },
];
