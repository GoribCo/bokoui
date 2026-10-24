import { AuthService } from "./auth.service";
import { MenuService } from "./menu.service";
import { NotificationService } from "./notification.service";
import { OrganizationService } from "./organization.service";
import { ProfileService } from "./profile.service";
import { RecordService } from "./record.service"; // demo
import { SearchService } from "./search.service";
import { SessionService } from "./session.service";
import { StaffService } from "./staff.service"; // demo

/**
 * The one instance of each service. Hooks, Server Components, layouts and route files all import these;
 * nobody creates a service with `new`. They work in the browser and on the server (see `ApiClient`).
 */
export const authService = new AuthService();
export const searchService = new SearchService();
export const sessionService = new SessionService();
export const organizationService = new OrganizationService();
export const menuService = new MenuService();
export const profileService = new ProfileService();
export const notificationService = new NotificationService();
export const recordService = new RecordService(); // demo
export const staffService = new StaffService(); // demo
