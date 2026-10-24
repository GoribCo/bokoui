import { cache } from "react";
import { organizationService } from "@/lib/services";

/** One lookup per request, shared by `generateMetadata` and the page; the service keeps it in the data cache. */
export const getPublicOrganization = cache(organizationService.getPublicOrganization.bind(organizationService));

/** Slugs of one type, for the static demo to build its profile pages ahead. */
export const listPublicSlugs = async (type: string) =>
  (await organizationService.listPublicOrganizations()).filter((org) => org.type === type).map(({ slug }) => ({ slug }));
