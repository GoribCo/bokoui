// Every screen reads data through these interfaces; swap the mocks for API calls in this one file.
import { menusByOrganization } from '~/data/menus'
import { notifications } from '~/data/notifications'
import { commonMenu, organizations, profile } from '~/data/organizations'
import { people } from '~/data/people'
import { publicOrganizations } from '~/data/public-organizations'
import { records } from '~/data/records'
import type { MenuGroup, MenuItem, Notification, Organization, OrganizationType, PublicOrganization, SampleRecord, UserProfile } from '~/utils/types'

export interface RecordQuery {
  status?: 'all' | SampleRecord['status']
  q?: string
  page?: number
  pageSize?: number
}

export interface Services {
  organizations(): Promise<Organization[]>
  menu(organizationId: string): Promise<MenuGroup[]>
  commonMenu(): Promise<MenuItem[]>
  profile(): Promise<UserProfile>
  notifications(): Promise<Notification[]>
  records(query?: RecordQuery): Promise<{ items: SampleRecord[]; total: number; totalPages: number; page: number }>
  publicOrganizations(): Promise<PublicOrganization[]>
  publicOrganization(type: OrganizationType, slug: string): Promise<PublicOrganization | null>
  people(): Promise<typeof people>
  createStaff(values: { name: string; email: string; notes: string; notify: boolean }): Promise<{ id: number }>
}

export const services: Services = {
  organizations: async () => organizations,
  menu: async (organizationId) => menusByOrganization[organizationId] ?? [],
  commonMenu: async () => commonMenu,
  profile: async () => profile,
  notifications: async () => notifications,
  async records({ status = 'all', q = '', page = 1, pageSize = 100 } = {}) {
    const needle = q.trim().toLowerCase()
    const all = records.filter((r) => (status === 'all' || r.status === status) && (!needle || r.name.toLowerCase().includes(needle)))
    const totalPages = Math.max(1, Math.ceil(all.length / pageSize))
    const current = Math.min(Math.max(1, page), totalPages)
    return { items: all.slice((current - 1) * pageSize, current * pageSize), total: all.length, totalPages, page: current }
  },
  publicOrganizations: async () => publicOrganizations,
  publicOrganization: async (type, slug) => publicOrganizations.find((o) => o.type === type && o.slug === slug) ?? null,
  people: async () => people,
  createStaff: async () => ({ id: Date.now() }),
}
