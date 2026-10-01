import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { publicOrganizationPath } from "@/lib/organization/organization-types";
import { getServerApi } from "@/lib/api/server";
import { OrganizationService } from "@/lib/services/organization.service";

/** Lists the public organization profiles; everything else is behind sign-in. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const organizations = await new OrganizationService(await getServerApi({ withCookies: false })).listPublicOrganizations();
  const home = { url: siteConfig.url, changeFrequency: "monthly" as const, priority: 1 };
  const profiles = organizations.map((org) => ({
    url: `${siteConfig.url}${publicOrganizationPath(org)}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  return [home, ...profiles];
}
