import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

/** AsyncStorage key that remembers the role the user chose to act as. */
export const ACTIVE_ROLE_STORAGE_KEY = "bokoui-layouts:active-role";

export interface RoleState {
  /** The role the user acts as, or `null` for all of their roles in the organization. */
  activeRole: string | null;
}

export interface RoleActions {
  setActiveRole: (role: string | null) => void;
}

export type RoleStore = RoleState & RoleActions;

export function createRoleStore(initial: RoleState = { activeRole: null }) {
  return createStore<RoleStore>()(
    persist(
      (set) => ({
        ...initial,
        setActiveRole: (activeRole) => set({ activeRole }),
      }),
      {
        name: ACTIVE_ROLE_STORAGE_KEY,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: ({ activeRole }) => ({ activeRole }),
      },
    ),
  );
}

export type RoleStoreApi = ReturnType<typeof createRoleStore>;

export const roleStore = createRoleStore();

export const roleSelectors = {
  activeRole: (state: RoleStore) => state.activeRole,
  setActiveRole: (state: RoleStore) => state.setActiveRole,
} as const;
