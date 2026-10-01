"use server";

import { menuSchema } from "@/lib/schemas";
import type { MenuGroup, Organization } from "@/lib/types";
import { services } from "./index";

/**
 * Client-side data access: the service registry is server-only, so TanStack Query calls these actions.
 * Each one re-checks the session on the server (authorization is never decided by the client).
 */
export async function fetchOrganizations(): Promise<Organization[]> {
  const session = await services.session.getSession();
  if (!session) return [];
  return services.organizations.getOrganizations();
}

export async function fetchMenu(organizationId: string): Promise<MenuGroup[]> {
  const session = await services.session.getSession();
  if (!session?.organizations.some((org) => org.id === organizationId)) return [];
  return menuSchema.parse(await services.menus.getMenu(organizationId));
}
