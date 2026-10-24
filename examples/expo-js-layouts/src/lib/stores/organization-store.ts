import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

/** AsyncStorage key that remembers the active organization. */
export const ACTIVE_ORGANIZATION_STORAGE_KEY = "bokoui-layouts:active-organization";

export interface OrganizationState {
  /** `null` until the user picks one; the session default applies then (`resolveActiveOrganizationId`). */
  activeOrganizationId: string | null;
}

export interface OrganizationActions {
  setActiveOrganization: (organizationId: string | null) => void;
}

export type OrganizationStore = OrganizationState & OrganizationActions;

export function createOrganizationStore(initial: OrganizationState = { activeOrganizationId: null }) {
  return createStore<OrganizationStore>()(
    persist(
      (set) => ({
        ...initial,
        setActiveOrganization: (activeOrganizationId) => set({ activeOrganizationId }),
      }),
      {
        name: ACTIVE_ORGANIZATION_STORAGE_KEY,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: ({ activeOrganizationId }) => ({ activeOrganizationId }),
      },
    ),
  );
}

export type OrganizationStoreApi = ReturnType<typeof createOrganizationStore>;

export const organizationStore = createOrganizationStore();

export const organizationSelectors = {
  activeOrganizationId: (state: OrganizationStore) => state.activeOrganizationId,
  setActiveOrganization: (state: OrganizationStore) => state.setActiveOrganization,
} as const;
