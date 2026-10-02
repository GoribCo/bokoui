import type { organizationTypes } from "@/lib/config/organization-types";
import type { Role } from "./role";

/** Keys of the registry in `config/organization-types.ts`. */
export type OrganizationType = keyof typeof organizationTypes;

export interface Organization {
  id: string;
  /** Unique within its type; used in the public profile URL. */
  slug: string;
  name: string;
  logoUrl?: string;
  type: OrganizationType;
  /** Roles the signed-in user holds in this organization. */
  roles: Role[];
}

/** Type-specific profile data; adding an organization type adds one member here. */
export type OrganizationDetails =
  | { type: "hospital"; beds: number; departments: string[]; emergency: boolean }
  | { type: "pharmacy"; licenseNo: string; open24h: boolean; delivery: boolean }
  | { type: "company"; industry: string; employees: number; founded: number };

/** What the public profile page shows; viewable without login. */
export interface PublicOrganization {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  type: OrganizationType;
  description: string;
  city: string;
  phone?: string;
  website?: string;
  details: OrganizationDetails;
}
