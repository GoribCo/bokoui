import type { MenuGroup, MenuItem, Role } from './types'

export const hasAnyRole = (roles: readonly Role[], required?: readonly Role[]) =>
  !required || required.length === 0 || required.some((r) => roles.includes(r))

/** Permissions follow roles: an admin may view access control and reports. */
export const permissionsFor = (roles: readonly Role[]): string[] =>
  roles.includes('admin') ? ['organization.access.view', 'organization.reports.view'] : []

export interface Access {
  roles: readonly Role[]
  permissions: readonly string[]
}

type Guarded = { requiredRoles?: Role[]; requiredPermissions?: string[] }

/** No requirement means everyone; a permission requirement without the permission hides the entry (fail closed). */
const allowed = (entry: Guarded, access: Access) =>
  hasAnyRole(access.roles, entry.requiredRoles) &&
  (!entry.requiredPermissions?.length || entry.requiredPermissions.some((p) => access.permissions.includes(p)))

function filterItems(items: MenuItem[], access: Access): MenuItem[] {
  const visible: MenuItem[] = []
  for (const item of items) {
    if (!allowed(item, access)) continue
    if (!item.children) {
      visible.push(item)
      continue
    }
    const children = filterItems(item.children, access)
    // A pure group (no link of its own) with nothing left to show disappears.
    if (children.length === 0 && !item.href) continue
    visible.push({ ...item, children: children.length ? children : undefined })
  }
  return visible
}

/** Removes what the user may not see; groups left empty disappear. */
export function filterMenu(groups: MenuGroup[], access: Access): MenuGroup[] {
  return groups
    .filter((g) => allowed(g, access))
    .map((g) => ({ ...g, items: filterItems(g.items, access) }))
    .filter((g) => g.items.length > 0)
}
