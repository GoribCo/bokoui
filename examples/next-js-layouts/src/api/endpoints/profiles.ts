import { profile } from "../data/organizations";
import { requireSession } from "../auth";
import type { ApiHandler } from "../types";

/** GET /profiles/me */
export const getMyProfile: ApiHandler = (context) => {
  requireSession(context);
  return { results: profile };
};
