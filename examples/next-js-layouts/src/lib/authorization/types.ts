/*
 * Types of the permission evaluator, ported from the rxprofile web app and made generic. A user holds
 * memberships in organizations; roles are assigned to a membership within a scope; a role grants
 * permissions; explicit overrides can allow or deny single permissions. Everything is data, nothing here
 * knows about a particular product.
 */

/** Where a permission applies. An organization scope also covers its branches; a branch scope never reaches up or sideways. */
export type WorkspaceContext =
  | { kind: "personal"; personId: string }
  | { kind: "platform" }
  | { kind: "organization"; organizationId: string }
  | { kind: "branch"; organizationId: string; branchId: string };

export type ScopeKind = WorkspaceContext["kind"];

/** Time and status window shared by memberships, assignments and overrides. Instants are ISO 8601 with a zone. */
export interface Lifecycle {
  status: "active" | "suspended" | "revoked";
  validFrom: string;
  /** `null` means no end. */
  validUntil: string | null;
}

export interface Membership extends Lifecycle {
  id: string;
  userId: string;
  organizationId: string;
}

export interface Assignment extends Lifecycle {
  id: string;
  userId: string;
  membershipId: string;
  roleId: string;
  scope: WorkspaceContext;
}

export interface PermissionOverride extends Lifecycle {
  id: string;
  userId: string;
  /** Required for organization and branch scopes: the membership the override belongs to. */
  membershipId?: string;
  permissionId: string;
  effect: "allow" | "deny";
  scope: WorkspaceContext;
}

export interface RoleDefinition {
  id: string;
  allowedPermissions: readonly string[];
}

export interface AuthorizationUser {
  id: string;
  personId: string;
  memberships: Membership[];
  assignments: Assignment[];
  /** Assignments of roles that apply to the whole platform, not to an organization. */
  platformAssignments: Assignment[];
  overrides: PermissionOverride[];
}

export interface AuthorizationEnvironment {
  /** The instant checks are made at, in milliseconds since the epoch. */
  now: number;
  roles: RoleDefinition[];
  organizations: { id: string; status: "active" | "suspended" }[];
  branches: { id: string; organizationId: string; status: "active" | "suspended" }[];
}
