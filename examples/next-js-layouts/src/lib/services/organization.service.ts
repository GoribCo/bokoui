import { z } from "zod";
import { isApiError } from "@/lib/api/errors";
import { organizationSchema, publicOrganizationSchema } from "@/lib/schemas";
import type { Organization, OrganizationType, PublicOrganization } from "@/lib/types";
import { BaseService } from "./base.service";

/** Profiles change rarely and are read by anyone: keep each one for an hour, or until its tag is revalidated. */
const PUBLIC_REVALIDATE_SECONDS = 60 * 60;

export const publicOrganizationTag = (type: OrganizationType, slug: string) => `public-organization:${type}:${slug}`;

export class OrganizationService extends BaseService {
  /** Organizations of the signed-in user, with their roles in each. */
  async getOrganizations(): Promise<Organization[]> {
    return z.array(organizationSchema).parse(await this.client.get("/organizations"));
  }

  /** Every organization with a public profile (for the sitemap and the landing page). */
  async listPublicOrganizations(): Promise<PublicOrganization[]> {
    return z.array(publicOrganizationSchema).parse(await this.client.get("/public/organizations"));
  }

  /**
   * Public profile for `/{type}/{slug}`; `null` when the slug is unknown. Kept by the Next.js data cache
   * (FR-3.9, "on demand with caching"): nothing is prebuilt, the first request fetches and later ones reuse it.
   */
  async getPublicOrganization(type: OrganizationType, slug: string): Promise<PublicOrganization | null> {
    try {
      return publicOrganizationSchema.parse(await this.client.get(`/public/organizations/${type}/${slug}`, undefined, {
          revalidate: PUBLIC_REVALIDATE_SECONDS,
          tags: ["public-organization", publicOrganizationTag(type, slug)],
        }));
    } catch (error) {
      if (isApiError(error, 404)) return null;
      throw error;
    }
  }
}
