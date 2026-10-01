import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { publicOrganizationPath } from "@/lib/organization/organization-types";
import { getServerServices } from "@/lib/services/server";

/** Lists the public organization profiles; everything else is behind sign-in. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const organizations = await (await getServerServices({ withCookies: false })).organizations.listPublicOrganizations();
  const home = { url: siteConfig.url, changeFrequency: "monthly" as const, priority: 1 };
  const profiles = organizations.map((org) => ({
    url: `${siteConfig.url}${publicOrganizationPath(org)}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  return [home, ...profiles];
}
