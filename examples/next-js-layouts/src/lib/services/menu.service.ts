import { z } from "zod";
import { menuItemSchema, menuSchema } from "@/lib/schemas";
import type { MenuGroup, MenuItem } from "@/lib/types";
import { BaseService } from "./base.service";

export class MenuService extends BaseService {
  /** Main navigation of one organization, unfiltered (filtering by role happens in the shell). */
  async getMenu(organizationId: string): Promise<MenuGroup[]> {
    return menuSchema.parse(await this.client.get(`/organizations/${organizationId}/menu`));
  }

  /** Bottom menu shared by all organizations. */
  async getCommonMenu(): Promise<MenuItem[]> {
    return z.array(menuItemSchema).parse(await this.client.get("/menu/common"));
  }
}
