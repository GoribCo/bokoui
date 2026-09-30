import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { organizationSegments } from "@/lib/organization/organization-types";

/** Only public organization profiles are crawlable; the signed-in area is not. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: organizationSegments.map((segment) => `/${segment}/`),
      disallow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
