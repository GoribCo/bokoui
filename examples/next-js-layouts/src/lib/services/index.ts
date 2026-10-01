import { apiClient, type ApiClient } from "@/lib/api/client";
import { MenuService } from "./menu.service";
import { NotificationService } from "./notification.service";
import { OrganizationService } from "./organization.service";
import { ProfileService } from "./profile.service";
import { RecordService } from "./record.service";
import { SessionService } from "./session.service";
import { StaffService } from "./staff.service";

/** All services bound to one API client. Servers build their own with `getServerServices()`. */
export function createServices(client: ApiClient) {
  return {
    session: new SessionService(client),
    organizations: new OrganizationService(client),
    menus: new MenuService(client),
    profiles: new ProfileService(client),
    notifications: new NotificationService(client),
    records: new RecordService(client),
    staff: new StaffService(client),
  };
}

export type Services = ReturnType<typeof createServices>;

/** Services for the browser; hooks use these. */
export const services = createServices(apiClient);

export { MenuService, NotificationService, OrganizationService, ProfileService, RecordService, SessionService, StaffService };
