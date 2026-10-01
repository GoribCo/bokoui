import { cache } from "react";
import { services } from "@/lib/services";

/** Session of the current request; cached so layouts and pages share one lookup. */
export const getSession = cache(() => services.session.getSession());
