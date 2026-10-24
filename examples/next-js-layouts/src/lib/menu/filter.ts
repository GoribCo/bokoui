import { hasAnyRole } from "@/lib/access";
import type { MenuGroup, MenuItem, Role } from "@/lib/types";

/** Roles and permissions of the user in the active organization. */
export interface MenuAccess {
  roles: readonly Role[];
  permissions: readonly string[];
}

/** Both checks must pass. No requirement means everyone; a permission requirement without the permission hides the entry (fail closed). */
function allowed(entry: { requiredRoles?: Role[]; requiredPermissions?: string[] }, access: MenuAccess): boolean {
  if (!hasAnyRole(access.roles, entry.requiredRoles)) return false;
  const required = entry.requiredPermissions;
  return !required || required.length === 0 || required.some((permission) => access.permissions.includes(permission));
}

function filterItems(items: MenuItem[], access: MenuAccess): MenuItem[] {
  const visible: MenuItem[] = [];
  for (const item of items) {
    if (!allowed(item, access)) continue;
    if (!item.children) {
      visible.push(item);
      continue;
    }
    const children = filterItems(item.children, access);
    // A pure group (no link of its own) with nothing left to show disappears.
    if (children.length === 0 && !item.href) continue;
    visible.push({ ...item, children: children.length > 0 ? children : undefined });
  }
  return visible;
}

/**
 * Keeps what the user may see; groups and pure parent items with no visible children are hidden (FR-4.3).
 * `access` may be just the roles, in which case entries that require a permission are hidden.
 */
export function filterMenuByRoles(groups: MenuGroup[], access: readonly Role[] | MenuAccess): MenuGroup[] {
  const resolved: MenuAccess = Array.isArray(access) ? { roles: access as readonly Role[], permissions: [] } : (access as MenuAccess);
  const result: MenuGroup[] = [];
  for (const group of groups) {
    if (!allowed(group, resolved)) continue;
    const items = filterItems(group.items, resolved);
    if (items.length > 0) result.push({ ...group, items });
  }
  return result;
}
