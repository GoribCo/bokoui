import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { publicOrganizationPath } from "@/lib/organization/organization-types";
import { services } from "@/lib/services";

/** Lists the public organization profiles; everything else is behind sign-in. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const organizations = await services.organizations.listPublicOrganizations();
  return organizations.map((org) => ({
    url: `${siteConfig.url}${publicOrganizationPath(org)}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));
}
