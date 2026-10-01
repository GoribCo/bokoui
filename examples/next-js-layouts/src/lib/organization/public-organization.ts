import { unstable_cache } from "next/cache";
import { getServerApi } from "@/lib/api/server";
import { OrganizationService } from "@/lib/services/organization.service";
import type { OrganizationType, PublicOrganization } from "@/lib/types";

/** Profiles change rarely and are read by anyone: keep each one for an hour, or until its tag is revalidated. */
const REVALIDATE_SECONDS = 60 * 60;

export const publicOrganizationTag = (type: OrganizationType, slug: string) => `public-organization:${type}:${slug}`;

/**
 * Cached lookup of a public profile (FR-3.9, "on demand with caching"): nothing is prebuilt, the first
 * request fetches from the service and later ones reuse the result. `null` (unknown slug) is cached too.
 */
export async function getPublicOrganization(type: OrganizationType, slug: string): Promise<PublicOrganization | null> {
  // Resolved outside the cached function: it reads request headers, and public data needs no cookies.
  const organizations = new OrganizationService(await getServerApi({ withCookies: false }));
  return unstable_cache(
    () => organizations.getPublicOrganization(type, slug),
    ["public-organization", type, slug],
    { revalidate: REVALIDATE_SECONDS, tags: ["public-organization", publicOrganizationTag(type, slug)] },
  )();
}
