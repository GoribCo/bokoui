import { cache } from "react";
import { getServerServices } from "@/lib/services/server";

/** Session of the current request; cached so layouts and pages share one lookup. */
export const getSession = cache(async () => (await getServerServices()).session.getSession());
