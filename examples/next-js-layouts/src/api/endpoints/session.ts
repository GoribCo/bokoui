import { organizationsFor, profileFor } from "../data/organizations";
import { requireSession } from "../auth";
import type { ApiHandler } from "../types";

/** GET /session */
export const getSession: ApiHandler = (context) => {
  const userId = requireSession(context);
  const { id, name, email, avatarUrl } = profileFor(userId);
  const organizations = organizationsFor(userId);
  return {
    results: {
      user: { id, name, email, avatarUrl },
      organizations,
      defaultOrganizationId: organizations[0]?.id ?? null,
    },
  };
};
