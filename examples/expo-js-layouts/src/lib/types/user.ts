import type { Organization } from "./organization";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

/** Signed-in state handed to the shell after login. */
export interface Session {
  user: User;
  organizations: Organization[];
  /** Organization to open when nothing was remembered; `null` for a user who belongs to none. */
  defaultOrganizationId: string | null;
}

/** Extended account data for the profile page. */
export interface UserProfile extends User {
  phone?: string;
  jobTitle?: string;
  /** ISO date. */
  joinedAt: string;
}
