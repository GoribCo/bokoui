import { services } from '~/services'
import { filterMenu, permissionsFor } from '~/utils/access'
import { findActiveTrail } from '~/utils/active'

const PUBLIC = ['/help', '/contact', '/legal']

/** A page that exists in the organization's menu but is hidden from the user's roles answers 403 instead of rendering. */
export default defineNuxtRouteMiddleware(async (to) => {
  if (PUBLIC.some((p) => to.path === p || to.path.startsWith(`${p}/`))) return
  const id = useCookie<string>('boko_org').value
  const orgs = await services.organizations()
  const org = orgs.find((o) => o.id === id) ?? orgs[0]
  if (!org) return
  const full = await services.menu(org.id)
  const visible = filterMenu(full, { roles: org.roles, permissions: permissionsFor(org.roles) })
  if (findActiveTrail(full, to.path) && !findActiveTrail(visible, to.path)) {
    return abortNavigation(createError({ statusCode: 403, statusMessage: 'Forbidden' }))
  }
})
