import type {
  MenuGroup,
  MenuItem,
  Organization,
  OrganizationType,
  PublicOrganization,
  Session,
  UserProfile,
} from "@/lib/types";

/** Reads the signed-in session; `null` when signed out. */
export interface SessionService {
  getSession(): Promise<Session | null>;
}

export interface OrganizationService {
  /** Organizations the signed-in user belongs to, with their roles in each. */
  getOrganizations(): Promise<Organization[]>;
  /** Every organization with a public profile (for the sitemap). */
  listPublicOrganizations(): Promise<PublicOrganization[]>;
  /** Public profile for `/{type}/{slug}`; `null` when the slug is unknown. */
  getPublicOrganization(type: OrganizationType, slug: string): Promise<PublicOrganization | null>;
}

export interface MenuService {
  /** Main navigation of one organization, unfiltered (filtering by role happens in the shell). */
  getMenu(organizationId: string): Promise<MenuGroup[]>;
  /** Bottom menu shared by all organizations. */
  getCommonMenu(): Promise<MenuItem[]>;
}

export interface ProfileService {
  getProfile(userId: string): Promise<UserProfile | null>;
}

export interface Services {
  session: SessionService;
  organizations: OrganizationService;
  menus: MenuService;
  profiles: ProfileService;
}
