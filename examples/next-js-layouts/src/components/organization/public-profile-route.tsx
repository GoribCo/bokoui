import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProfile } from "@/components/organization/public-profile";
import { publicOrganizationPath } from "@/lib/organization/organization-types";
import { getPublicOrganization, listPublicSlugs } from "@/lib/organization/public-organization";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo";
import type { OrganizationType, PublicOrganization } from "@/lib/types";

/** schema.org type of each organization type. */
const schemaOrgType: Record<OrganizationType, string> = {
  hospital: "Hospital",
  pharmacy: "Pharmacy",
  company: "Organization",
};

/** Structured data for search engines. `<` is escaped so a name can never close the script tag. */
function structuredData(organization: PublicOrganization) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": schemaOrgType[organization.type],
    name: organization.name,
    description: organization.description,
    url: `${siteConfig.url}${publicOrganizationPath(organization)}`,
    ...(organization.logoUrl ? { logo: organization.logoUrl } : {}),
    ...(organization.phone ? { telephone: organization.phone } : {}),
    ...(organization.website ? { sameAs: [organization.website] } : {}),
    address: { "@type": "PostalAddress", addressLocality: organization.city },
  }).replace(/</g, "\\u003c");
}

interface RouteProps {
  params: Promise<{ slug: string }>;
}

/**
 * Page and metadata for `/{segment}/[slug]` of one organization type. Each route folder is three lines
 * around this, so a new type adds a registry entry and a folder, nothing else (FR-3.8).
 */
export function createPublicProfileRoute(type: OrganizationType) {
  async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
    const { slug } = await params;
    const organization = await getPublicOrganization(type, slug);
    if (!organization) return buildMetadata({ title: "Not found", noindex: true });
    return buildMetadata({
      title: organization.name,
      description: organization.description,
      path: publicOrganizationPath(organization),
      ogType: "profile",
    });
  }

  async function Page({ params }: RouteProps) {
    const { slug } = await params;
    const organization = await getPublicOrganization(type, slug);
    if (!organization) notFound();
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(organization) }} />
        <PublicProfile organization={organization} />
      </>
    );
  }

  /** Static demo only: pages are built ahead for every sample organization of this type. */
  async function generateStaticParams() {
    if (process.env.NEXT_PUBLIC_DEMO !== "true") return [];
    return listPublicSlugs(type);
  }

  return { generateMetadata, Page, generateStaticParams };
}
