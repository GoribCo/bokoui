import { unstable_cache } from "next/cache";
import { services } from "@/services";
import type { OrganizationType, PublicOrganization } from "@/types";

/** Profiles change rarely and are read by anyone: keep each one for an hour, or until its tag is revalidated. */
const REVALIDATE_SECONDS = 60 * 60;

export const publicOrganizationTag = (type: OrganizationType, slug: string) => `public-organization:${type}:${slug}`;

/**
 * Cached lookup of a public profile (FR-3.9, "on demand with caching"): nothing is prebuilt, the first
 * request fetches from the service and later ones reuse the result. `null` (unknown slug) is cached too.
 */
export function getPublicOrganization(type: OrganizationType, slug: string): Promise<PublicOrganization | null> {
  return unstable_cache(
    () => services.organizations.getPublicOrganization(type, slug),
    ["public-organization", type, slug],
    { revalidate: REVALIDATE_SECONDS, tags: ["public-organization", publicOrganizationTag(type, slug)] },
  )();
}
