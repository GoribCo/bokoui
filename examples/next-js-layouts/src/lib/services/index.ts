import { apiClient, type ApiClient } from "@/lib/api/client";
import { createMenuService } from "./menu.service";
import { createNotificationService } from "./notification.service";
import { createOrganizationService } from "./organization.service";
import { createProfileService } from "./profile.service";
import { createRecordService } from "./record.service";
import { createSessionService } from "./session.service";
import { createStaffService } from "./staff.service";

/** All services bound to one API client. Servers build their own with `getServerServices()`. */
export function createServices(client: ApiClient) {
  return {
    session: createSessionService(client),
    organizations: createOrganizationService(client),
    menus: createMenuService(client),
    profiles: createProfileService(client),
    notifications: createNotificationService(client),
    records: createRecordService(client),
    staff: createStaffService(client),
  };
}

export type Services = ReturnType<typeof createServices>;

/** Services for the browser; hooks use these. */
export const services = createServices(apiClient);
