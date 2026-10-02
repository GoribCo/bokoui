import type { AuthorizationEnvironment, AuthorizationUser, Lifecycle, WorkspaceContext } from "./types";

const instantPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

/** Parses a strict ISO instant; anything else (including impossible dates) is `NaN`, which fails closed. */
function parseInstant(value: string): number {
  if (!instantPattern.test(value)) return NaN;
  const day = Date.parse(`${value.slice(0, 10)}T00:00:00Z`);
  if (
    !Number.isFinite(day) ||
    new Date(day).toISOString().slice(0, 10) !== value.slice(0, 10) ||
    Number(value.slice(11, 13)) > 23 ||
    Number(value.slice(14, 16)) > 59 ||
    Number(value.slice(17, 19)) > 59
  ) {
    return NaN;
  }
  return Date.parse(value);
}

/** Active status, started, not ended, and a well-formed window. Anything unclear is not active. */
export function isCurrentlyActive(value: Lifecycle, now: number): boolean {
  if (value.status !== "active" || !Number.isFinite(now) || !instantPattern.test(value.validFrom)) return false;
  const start = parseInstant(value.validFrom);
  const end = value.validUntil === null ? Infinity : parseInstant(value.validUntil);
  return Number.isFinite(start) && start < end && start <= now && now < end;
}

export function sameScope(a: WorkspaceContext, b: WorkspaceContext): boolean {
  if (a.kind !== b.kind) return false;
  switch (a.kind) {
    case "personal":
      return b.kind === "personal" && a.personId === b.personId;
    case "platform":
      return true;
    case "organization":
      return b.kind === "organization" && a.organizationId === b.organizationId;
    case "branch":
      return b.kind === "branch" && a.organizationId === b.organizationId && a.branchId === b.branchId;
  }
}

/** Organization-wide is explicit inheritance; branch assignments never apply upward or sideways. */
export function scopeApplies(scope: WorkspaceContext, context: WorkspaceContext): boolean {
  return (
    sameScope(scope, context) ||
    (scope.kind === "organization" && context.kind === "branch" && scope.organizationId === context.organizationId)
  );
}

/** The context must exist and be active: a personal context is the user's own, organizations and branches must be active. */
export function isValidContext(user: AuthorizationUser, context: WorkspaceContext, env: AuthorizationEnvironment): boolean {
  if (context.kind === "personal") return context.personId === user.personId;
  if (context.kind === "platform") return true;
  if (!env.organizations.some((org) => org.id === context.organizationId && org.status === "active")) return false;
  return (
    context.kind === "organization" ||
    env.branches.some(
      (branch) => branch.id === context.branchId && branch.organizationId === context.organizationId && branch.status === "active",
    )
  );
}

export function getUserMemberships(user: AuthorizationUser, env: AuthorizationEnvironment) {
  return user.memberships.filter(
    (membership) =>
      membership.userId === user.id &&
      isCurrentlyActive(membership, env.now) &&
      env.organizations.some((org) => org.id === membership.organizationId && org.status === "active"),
  );
}

/** Assignments that count in `context`: active, in scope, and backed by an active membership of that organization. */
export function getApplicableAssignments(user: AuthorizationUser, context: WorkspaceContext, env: AuthorizationEnvironment) {
  if (!isValidContext(user, context, env) || context.kind === "personal" || context.kind === "platform") return [];
  const memberships = getUserMemberships(user, env);
  return user.assignments.filter((assignment) => {
    const { scope } = assignment;
    if (scope.kind === "personal" || scope.kind === "platform") return false;
    return (
      isCurrentlyActive(assignment, env.now) &&
      scopeApplies(scope, context) &&
      memberships.some((membership) => membership.id === assignment.membershipId && membership.organizationId === scope.organizationId)
    );
  });
}
