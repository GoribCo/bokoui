import { services } from '~/services'
import { filterMenu, permissionsFor } from '~/utils/access'
import type { Organization } from '~/utils/types'

/** Shell state that must match between server and browser lives in cookies. */
export function useShellState() {
  return {
    orgId: useCookie<string>('boko_org', { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' }),
    collapsed: useCookie<boolean>('boko_sidebar', { default: () => false, maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' }),
    drawerOpen: useState('boko_drawer', () => false),
  }
}

/** Organizations, the active one, and the menu its roles may see. */
export async function useShell() {
  const state = useShellState()
  // Start every fetch before the first await: the Nuxt context is lost after it.
  const orgsReq = useAsyncData('organizations', () => services.organizations(), { default: () => [] as Organization[] })
  const organizations = orgsReq.data
  const org = computed(() => organizations.value.find((o) => o.id === state.orgId.value) ?? organizations.value[0])
  // Resolves the organization itself: `org` is not known until the first fetch above has finished.
  const menuReq = useAsyncData(
    'menu',
    async () => {
      const all = await services.organizations()
      return services.menu((all.find((o) => o.id === state.orgId.value) ?? all[0])?.id ?? '')
    },
    { watch: [state.orgId], default: () => [] },
  )
  const commonReq = useAsyncData('common-menu', () => services.commonMenu(), { default: () => [] })
  const profileReq = useAsyncData('profile', () => services.profile())
  await Promise.all([orgsReq, menuReq, commonReq, profileReq])
  const menu = menuReq.data
  const common = commonReq.data
  const profile = profileReq.data
  const access = computed(() => ({ roles: org.value?.roles ?? [], permissions: permissionsFor(org.value?.roles ?? []) }))
  const groups = computed(() => filterMenu(menu.value, access.value))
  const switchOrg = (id: string) => (state.orgId.value = id)
  return { ...state, organizations, org, groups, common, profile, switchOrg }
}
