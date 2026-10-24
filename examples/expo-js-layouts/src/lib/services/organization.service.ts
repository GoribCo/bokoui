import { isApiError } from "@/lib/api/errors";
import { endpoints } from "@/lib/contract";
import type { Organization, OrganizationType, PublicOrganization } from "@/lib/types";
import { BaseService } from "./base.service";

export class OrganizationService extends BaseService {
  /** Organizations of the signed-in user, with their roles in each. */
  getOrganizations(): Promise<Organization[]> {
    return this.request(endpoints.listOrganizations);
  }

  /** Every organization with a public profile (for the landing screen). */
  listPublicOrganizations(): Promise<PublicOrganization[]> {
    return this.request(endpoints.listPublicOrganizations);
  }

  /** Public profile for `/{type}/{slug}`; `null` when the slug is unknown. */
  async getPublicOrganization(type: OrganizationType, slug: string): Promise<PublicOrganization | null> {
    try {
      return await this.request(endpoints.getPublicOrganization, { params: { type, slug } });
    } catch (error) {
      if (isApiError(error, 404)) return null;
      throw error;
    }
  }
}
