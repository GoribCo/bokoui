import { commonMenu } from "@/lib/config/common-menu";
import { hospitalMenu, menusByOrganization } from "../data/menus";
import { organizationsFor } from "../data/organizations";
import { requireSession } from "../auth";
import { HttpError, type ApiHandler } from "../types";

/** GET /organizations/:organizationId/menu: main navigation of one organization, unfiltered by role. */
export const getMenu: ApiHandler = (context) => {
  const userId = requireSession(context);
  const { organizationId } = context.params;
  if (!organizationsFor(userId).some((org) => org.id === organizationId)) {
    throw new HttpError(403, "You do not belong to this organization", "FORBIDDEN");
  }
  // The generated stress organizations all use the large hospital menu.
  return { results: menusByOrganization[organizationId] ?? hospitalMenu };
};

/** GET /menu/common: bottom menu shared by all organizations. */
export const getCommonMenu: ApiHandler = (context) => {
  requireSession(context);
  return { results: commonMenu };
};
