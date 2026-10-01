import { isApiError } from "@/lib/api/errors";
import { endpoints } from "@/lib/contract";
import type { Organization, OrganizationType, PublicOrganization } from "@/lib/types";
import { BaseService } from "./base.service";

/** Profiles change rarely and are read by anyone: keep each one for an hour, or until its tag is revalidated. */
const PUBLIC_REVALIDATE_SECONDS = 60 * 60;

export const publicOrganizationTag = (type: OrganizationType, slug: string) => `public-organization:${type}:${slug}`;

export class OrganizationService extends BaseService {
  /** Organizations of the signed-in user, with their roles in each. */
  getOrganizations(): Promise<Organization[]> {
    return this.request(endpoints.listOrganizations);
  }

  /** Every organization with a public profile (for the sitemap and the landing page). */
  listPublicOrganizations(): Promise<PublicOrganization[]> {
    return this.request(endpoints.listPublicOrganizations);
  }

  /**
   * Public profile for `/{type}/{slug}`; `null` when the slug is unknown. Kept by the Next.js data cache
   * (FR-3.9, "on demand with caching"): nothing is prebuilt, the first request fetches and later ones reuse it.
   */
  async getPublicOrganization(type: OrganizationType, slug: string): Promise<PublicOrganization | null> {
    try {
      return await this.request(endpoints.getPublicOrganization, {
        params: { type, slug },
        cache: { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ["public-organization", publicOrganizationTag(type, slug)] },
      });
    } catch (error) {
      if (isApiError(error, 404)) return null;
      throw error;
    }
  }
}
