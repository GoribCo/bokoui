import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProfile } from "@/components/organization/public-profile";
import { publicOrganizationPath } from "@/lib/organization-types";
import { getPublicOrganization } from "@/lib/public-organization";
import { buildMetadata } from "@/lib/seo";
import type { OrganizationType } from "@/types";

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
    return <PublicProfile organization={organization} />;
  }

  return { generateMetadata, Page };
}
