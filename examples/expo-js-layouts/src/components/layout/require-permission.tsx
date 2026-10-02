import type { ReactNode } from "react";
import { useActiveOrganization } from "@/hooks/use-active-organization";
import type { PermissionId } from "@/lib/authorization";
import { ForbiddenView } from "./forbidden-view";

export interface RequirePermissionProps {
  permission: PermissionId;
  children: ReactNode;
}

/**
 * Guard for a screen or a whole route group: renders the 403 view unless the user, acting with the roles
 * they chose in the active organization, holds the permission. Hiding the menu entry is not protection;
 * this is, because it also covers a deep link.
 */
export function RequirePermission({ permission, children }: RequirePermissionProps) {
  const { permissions } = useActiveOrganization();
  return permissions.includes(permission) ? <>{children}</> : <ForbiddenView />;
}
