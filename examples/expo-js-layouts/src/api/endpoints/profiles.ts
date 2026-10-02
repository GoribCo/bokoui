import { profileFor } from "../data/organizations";
import { requireSession } from "../auth";
import type { ApiHandler } from "../types";

/** GET /profiles/me */
export const getMyProfile: ApiHandler = (context) => ({ results: profileFor(requireSession(context)) });
