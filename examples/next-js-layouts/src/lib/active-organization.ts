import type { Organization } from "@/types";

/**
 * Picks the organization to open: the remembered one if the user still belongs to it, otherwise the
 * session default, otherwise the first membership. Returns `null` only when the user has none.
 */
export function resolveActiveOrganizationId(
  organizations: readonly Organization[],
  remembered: string | undefined,
  defaultId: string,
): string | null {
  const candidates = [remembered, defaultId, organizations[0]?.id];
  return candidates.find((id) => id && organizations.some((org) => org.id === id)) ?? null;
}
