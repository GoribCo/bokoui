import { organizationsFor, publicOrganizations } from "../data/organizations";
import { requireSession } from "../auth";
import { HttpError, type ApiHandler } from "../types";

/** GET /organizations: organizations of the signed-in user, with their roles. */
export const listOrganizations: ApiHandler = (context) => ({ results: organizationsFor(requireSession(context)) });

/** GET /public/organizations: every organization with a public profile. */
export const listPublicOrganizations: ApiHandler = () => ({ results: publicOrganizations });

/** GET /public/organizations/:type/:slug */
export const getPublicOrganization: ApiHandler = ({ params }) => {
  const organization = publicOrganizations.find((org) => org.type === params.type && org.slug === params.slug);
  if (!organization) throw new HttpError(404, "Organization not found", "NOT_FOUND");
  return { results: organization };
};
