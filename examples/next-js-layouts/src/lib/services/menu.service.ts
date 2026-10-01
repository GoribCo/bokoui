import { z } from "zod";
import type { ApiClient } from "@/lib/api/client";
import { menuItemSchema, menuSchema } from "@/lib/schemas";
import type { MenuGroup, MenuItem } from "@/lib/types";

export function createMenuService(client: ApiClient) {
  return {
    /** Main navigation of one organization, unfiltered (filtering by role happens in the shell). */
    async getMenu(organizationId: string): Promise<MenuGroup[]> {
      return menuSchema.parse(await client.get(`/organizations/${organizationId}/menu`));
    },
    /** Bottom menu shared by all organizations. */
    async getCommonMenu(): Promise<MenuItem[]> {
      return z.array(menuItemSchema).parse(await client.get("/menu/common"));
    },
  };
}
