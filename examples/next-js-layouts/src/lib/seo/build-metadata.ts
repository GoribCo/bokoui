import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export interface BuildMetadataProps {
  /** Page title; the root title template appends the site name. */
  title: string;
  description?: string;
  /** Path of the page (e.g. "/hospital/green-valley"), used for the canonical and Open Graph URL. */
  path?: string;
  /** Keep the page out of search results (authenticated areas, sign-in). */
  noindex?: boolean;
  /** Open Graph image: absolute URL or a path resolved against `metadataBase`. */
  image?: string;
  /** Open Graph object type. */
  ogType?: "website" | "article" | "profile";
}

/** Builds page metadata with site-wide defaults (FR-11.1, FR-11.2, FR-11.5). */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path,
  noindex = false,
  image = siteConfig.ogImage,
  ogType = "website",
}: BuildMetadataProps): Metadata {
  return {
    title,
    description,
    alternates: path ? { canonical: path } : undefined,
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      type: ogType,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
