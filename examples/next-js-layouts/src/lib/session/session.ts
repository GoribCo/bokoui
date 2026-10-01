import { cache } from "react";
import { sessionService } from "@/lib/services";

/** Session of the current request; cached so layouts and pages share one lookup. */
export const getSession = cache(() => sessionService.getSession());
