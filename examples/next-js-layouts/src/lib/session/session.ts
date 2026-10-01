import { cache } from "react";
import { getServerApi } from "@/lib/api/server";
import { SessionService } from "@/lib/services/session.service";

/** Session of the current request; cached so layouts and pages share one lookup. */
export const getSession = cache(async () => new SessionService(await getServerApi()).getSession());
