import { AuthService } from "./auth.service";
import { MenuService } from "./menu.service";
import { NotificationService } from "./notification.service";
import { OrganizationService } from "./organization.service";
import { ProfileService } from "./profile.service";
import { SearchService } from "./search.service";
import { SessionService } from "./session.service";

/**
 * The one instance of each service. Hooks import these; nobody creates a service with `new`. This is the
 * one place to swap the sample API for a real one (see `lib/api/instance.ts`).
 */
export const authService = new AuthService();
export const searchService = new SearchService();
export const sessionService = new SessionService();
export const organizationService = new OrganizationService();
export const menuService = new MenuService();
export const profileService = new ProfileService();
export const notificationService = new NotificationService();
