import { endpoints } from "@/lib/contract";
import type { MenuGroup, MenuItem } from "@/lib/types";
import { BaseService } from "./base.service";

export class MenuService extends BaseService {
  /** Main navigation of one organization, unfiltered (filtering by role happens in the shell). */
  getMenu(organizationId: string): Promise<MenuGroup[]> {
    return this.request(endpoints.getMenu, { params: { organizationId } });
  }

  /** Bottom menu shared by all organizations. */
  getCommonMenu(): Promise<MenuItem[]> {
    return this.request(endpoints.getCommonMenu);
  }
}
