import { createMockServices } from "./mock";

export type {
  MenuService,
  OrganizationService,
  ProfileService,
  SessionService,
  Services,
} from "./types";

/** The one place where mock services are swapped for API-backed ones. */
export const services = createMockServices();
