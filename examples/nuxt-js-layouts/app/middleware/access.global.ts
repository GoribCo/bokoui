import { services } from '~/services'
import { filterMenu, permissionsFor } from '~/utils/access'
import { findActiveTrail } from '~/utils/active'

const PUBLIC = ['/help', '/contact', '/legal', '/hospital', '/pharmacy', '/company']
const isPublic = (path: string) => PUBLIC.some((p) => path === p || path.startsWith(`${p}/`))

/**
 * 1. Signed-out visitors may open only the public pages; the rest sends them to sign-in and back.
 * 2. A page that exists in the organization's menu but is hidden from the user's roles answers 403.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const session = useCookie<string | null>('boko_session').value
  const orgId = useCookie<string>('boko_org').value
  if (to.path === '/' || to.path === '/sign-in') return session ? navigateTo('/dashboard') : undefined
  if (isPublic(to.path)) return
  if (!session) return navigateTo({ path: '/sign-in', query: to.path === '/dashboard' ? {} : { next: to.fullPath } })

  const orgs = await services.organizations()
  const org = orgs.find((o) => o.id === orgId) ?? orgs[0]
  if (!org) return
  const full = await services.menu(org.id)
  const visible = filterMenu(full, { roles: org.roles, permissions: permissionsFor(org.roles) })
  if (findActiveTrail(full, to.path) && !findActiveTrail(visible, to.path)) {
    return abortNavigation(createError({ statusCode: 403, statusMessage: 'Forbidden' }))
  }
})
