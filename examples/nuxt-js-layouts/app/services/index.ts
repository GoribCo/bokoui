// Every screen reads data through these interfaces; swap the mocks for API calls in this one file.
import { menusByOrganization } from '~/data/menus'
import { commonMenu, organizations, profile } from '~/data/organizations'
import type { MenuGroup, MenuItem, Organization, UserProfile } from '~/utils/types'

export interface Services {
  organizations(): Promise<Organization[]>
  menu(organizationId: string): Promise<MenuGroup[]>
  commonMenu(): Promise<MenuItem[]>
  profile(): Promise<UserProfile>
}

export const services: Services = {
  organizations: async () => organizations,
  menu: async (organizationId) => menusByOrganization[organizationId] ?? [],
  commonMenu: async () => commonMenu,
  profile: async () => profile,
}
