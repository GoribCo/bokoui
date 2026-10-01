import { organizations, profile } from "../data/organizations";
import { requireSession } from "../auth";
import type { ApiHandler } from "../types";

/** GET /session */
export const getSession: ApiHandler = (context) => {
  requireSession(context);
  const { id, name, email, avatarUrl } = profile;
  return {
    results: {
      user: { id, name, email, avatarUrl },
      organizations,
      defaultOrganizationId: organizations[0].id,
    },
  };
};
