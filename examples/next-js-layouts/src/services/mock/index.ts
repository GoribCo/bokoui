import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/config/auth";
import { commonMenu } from "@/config/common-menu";
import { sessionSchema } from "@/schemas";
import type { Services } from "../types";
import { mockOrganizations, mockProfile, mockPublicOrganizations } from "./data";
import { mockMenus } from "./menus";

/** Mock implementations with the shape of the future API; swap them in `services/index.ts`. */
export function createMockServices(): Services {
  const { id, name, email, avatarUrl } = mockProfile;
  return {
    session: {
      async getSession() {
        if (!(await cookies()).has(SESSION_COOKIE)) return null;
        return sessionSchema.parse({
          user: { id, name, email, avatarUrl },
          organizations: mockOrganizations,
          defaultOrganizationId: mockOrganizations[0].id,
        });
      },
    },
    organizations: {
      async getOrganizations() {
        return mockOrganizations;
      },
      async listPublicOrganizations() {
        return mockPublicOrganizations;
      },
      async getPublicOrganization(type, slug) {
        return mockPublicOrganizations.find((o) => o.type === type && o.slug === slug) ?? null;
      },
    },
    menus: {
      async getMenu(organizationId) {
        return mockMenus[organizationId] ?? [];
      },
      async getCommonMenu() {
        return commonMenu;
      },
    },
    profiles: {
      async getProfile(userId) {
        return userId === mockProfile.id ? mockProfile : null;
      },
    },
  };
}
