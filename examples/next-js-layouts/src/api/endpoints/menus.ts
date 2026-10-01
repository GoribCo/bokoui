import { commonMenu } from "@/lib/config/common-menu";
import { menusByOrganization } from "../data/menus";
import { organizations } from "../data/organizations";
import { requireSession } from "../auth";
import { HttpError, type ApiHandler } from "../types";

/** GET /organizations/:organizationId/menu: main navigation of one organization, unfiltered by role. */
export const getMenu: ApiHandler = (context) => {
  requireSession(context);
  const { organizationId } = context.params;
  if (!organizations.some((org) => org.id === organizationId)) {
    throw new HttpError(403, "You do not belong to this organization", "FORBIDDEN");
  }
  return { results: menusByOrganization[organizationId] ?? [] };
};

/** GET /menu/common: bottom menu shared by all organizations. */
export const getCommonMenu: ApiHandler = (context) => {
  requireSession(context);
  return { results: commonMenu };
};
