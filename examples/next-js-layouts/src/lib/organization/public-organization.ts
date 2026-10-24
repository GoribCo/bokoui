import { cache } from "react";
import { organizationService } from "@/lib/services";

/** One lookup per request, shared by `generateMetadata` and the page; the service keeps it in the data cache. */
export const getPublicOrganization = cache(organizationService.getPublicOrganization.bind(organizationService));
