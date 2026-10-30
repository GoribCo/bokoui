export type Role = string

export interface MenuItem {
  id: string
  /** Fallback text, used when `labelKey` has no translation. */
  label: string
  labelKey?: string
  /** Key into the icon registry (`utils/icons.ts`). */
  icon?: string
  href?: string
  children?: MenuItem[]
  badge?: string | number
  /** Visible when the user holds any of these roles; no value means everyone. */
  requiredRoles?: Role[]
  /** Visible when the user holds at least one of these permissions in the active organization. */
  requiredPermissions?: string[]
}

export interface MenuGroup {
  id: string
  label: string
  labelKey?: string
  items: MenuItem[]
  requiredRoles?: Role[]
  requiredPermissions?: string[]
}

export type OrganizationType = 'hospital' | 'pharmacy' | 'company'

export interface Organization {
  id: string
  slug: string
  name: string
  type: OrganizationType
  /** Roles the signed-in user holds in this organization. */
  roles: Role[]
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  jobTitle?: string
  joinedAt: string
}

export type Locale = 'en' | 'bn'

export type NotificationKind = 'action' | 'info' | 'success' | 'invitation'

export interface Notification {
  id: string
  kind: NotificationKind
  urgent?: boolean
  title: string
  body: string
  time: string
  unread: boolean
  href?: string
}

export interface SampleRecord {
  id: number
  name: string
  department: string
  status: 'active' | 'archived'
  /** ISO date. */
  updated: string
}

export type OrganizationDetails =
  | { type: 'hospital'; beds: number; departments: string[]; emergency: boolean }
  | { type: 'pharmacy'; licenseNo: string; open24h: boolean; delivery: boolean }
  | { type: 'company'; industry: string; employees: number; founded: number }

export interface PublicOrganization {
  id: string
  slug: string
  name: string
  type: OrganizationType
  description: string
  city: string
  phone?: string
  website?: string
  details: OrganizationDetails
}
