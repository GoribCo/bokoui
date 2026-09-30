import { hasAnyRole } from "@/lib/access";
import type { MenuGroup, MenuItem, Role } from "@/lib/types";

function filterItems(items: MenuItem[], roles: readonly Role[]): MenuItem[] {
  const allowed: MenuItem[] = [];
  for (const item of items) {
    if (!hasAnyRole(roles, item.requiredRoles)) continue;
    if (!item.children) {
      allowed.push(item);
      continue;
    }
    const children = filterItems(item.children, roles);
    // A pure group (no link of its own) with nothing left to show disappears.
    if (children.length === 0 && !item.href) continue;
    allowed.push({ ...item, children: children.length > 0 ? children : undefined });
  }
  return allowed;
}

/** Keeps what the roles allow; groups and pure parent items with no visible children are hidden (FR-4.3). */
export function filterMenuByRoles(groups: MenuGroup[], roles: readonly Role[]): MenuGroup[] {
  const allowed: MenuGroup[] = [];
  for (const group of groups) {
    if (!hasAnyRole(roles, group.requiredRoles)) continue;
    const items = filterItems(group.items, roles);
    if (items.length > 0) allowed.push({ ...group, items });
  }
  return allowed;
}
