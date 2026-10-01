import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { createCookieStorage } from "@/lib/stores/cookie-storage";

/** Cookie that remembers the role the user chose to act as; also read on the server for access checks. */
export const ACTIVE_ROLE_COOKIE = "active-role";

export interface RoleState {
  /** The role the user acts as, or `null` for all of their roles in the organization. */
  activeRole: string | null;
}

export interface RoleActions {
  setActiveRole: (role: string | null) => void;
}

export type RoleStore = RoleState & RoleActions;

/** Cookie value to state: an empty value means "all roles". */
export const parseRoleCookie = (raw: string | undefined): string | null => (raw ? raw : null);

/** Per-provider store; persisted to a cookie and seeded by the server, so it does not rehydrate on the client. */
export function createRoleStore(initial: RoleState) {
  return createStore<RoleStore>()(
    persist(
      (set) => ({
        ...initial,
        setActiveRole: (activeRole) => set({ activeRole }),
      }),
      {
        name: ACTIVE_ROLE_COOKIE,
        storage: createJSONStorage(() =>
          createCookieStorage(ACTIVE_ROLE_COOKIE, "activeRole", (raw) => parseRoleCookie(raw)),
        ),
        partialize: ({ activeRole }) => ({ activeRole }),
        skipHydration: true,
      },
    ),
  );
}

export type RoleStoreApi = ReturnType<typeof createRoleStore>;

export const roleSelectors = {
  activeRole: (state: RoleStore) => state.activeRole,
  setActiveRole: (state: RoleStore) => state.setActiveRole,
} as const;
