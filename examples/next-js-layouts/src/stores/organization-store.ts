import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { createCookieStorage } from "@/lib/cookie-storage";

/** Cookie that remembers the active organization; also read on the server so the first render shows its menu. */
export const ACTIVE_ORGANIZATION_COOKIE = "active-organization";

export interface OrganizationState {
  activeOrganizationId: string;
}

export interface OrganizationActions {
  setActiveOrganization: (organizationId: string) => void;
}

export type OrganizationStore = OrganizationState & OrganizationActions;

/** Per-provider store; persisted to a cookie, seeded by the server, so it does not rehydrate on the client. */
export function createOrganizationStore(initial: OrganizationState) {
  return createStore<OrganizationStore>()(
    persist(
      (set) => ({
        ...initial,
        setActiveOrganization: (activeOrganizationId) => set({ activeOrganizationId }),
      }),
      {
        name: ACTIVE_ORGANIZATION_COOKIE,
        storage: createJSONStorage(() =>
          createCookieStorage(ACTIVE_ORGANIZATION_COOKIE, "activeOrganizationId", (raw) => raw),
        ),
        partialize: ({ activeOrganizationId }) => ({ activeOrganizationId }),
        skipHydration: true,
      },
    ),
  );
}

export type OrganizationStoreApi = ReturnType<typeof createOrganizationStore>;

export const organizationSelectors = {
  activeOrganizationId: (state: OrganizationStore) => state.activeOrganizationId,
  setActiveOrganization: (state: OrganizationStore) => state.setActiveOrganization,
} as const;
