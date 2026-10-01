import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { createCookieStorage } from "@/lib/stores/cookie-storage";

/** Cookie that remembers the collapsed sidebar; also read on the server for the first render. */
export const SIDEBAR_COOKIE = "sidebar-collapsed";

export interface UiState {
  sidebarCollapsed: boolean;
  bottomNavMoreOpen: boolean;
}

export interface UiActions {
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setBottomNavMoreOpen: (open: boolean) => void;
}

export type UiStore = UiState & UiActions;

export const defaultUiState: UiState = {
  sidebarCollapsed: false,
  bottomNavMoreOpen: false,
};

/** Parses the cookie value written by the store; used on the server to seed `initial`. */
export const parseSidebarCookie = (raw: string | undefined): boolean => raw === "true";

/**
 * Vanilla store factory (one store per provider). Only `sidebarCollapsed` is persisted; it is seeded
 * from the server-read cookie, so the store does not rehydrate on the client (`skipHydration`).
 */
export function createUiStore(initial: Partial<UiState> = {}) {
  return createStore<UiStore>()(
    persist(
      (set) => ({
        ...defaultUiState,
        ...initial,
        setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
        toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        setBottomNavMoreOpen: (bottomNavMoreOpen) => set({ bottomNavMoreOpen }),
      }),
      {
        name: SIDEBAR_COOKIE,
        storage: createJSONStorage(() => createCookieStorage(SIDEBAR_COOKIE, "sidebarCollapsed", parseSidebarCookie)),
        partialize: ({ sidebarCollapsed }) => ({ sidebarCollapsed }),
        skipHydration: true,
      },
    ),
  );
}

export type UiStoreApi = ReturnType<typeof createUiStore>;

/** Typed selectors: components subscribe to one field, not the whole store. */
export const uiSelectors = {
  sidebarCollapsed: (state: UiStore) => state.sidebarCollapsed,
  bottomNavMoreOpen: (state: UiStore) => state.bottomNavMoreOpen,
  actions: (state: UiStore) => ({
    setSidebarCollapsed: state.setSidebarCollapsed,
    toggleSidebar: state.toggleSidebar,
    setBottomNavMoreOpen: state.setBottomNavMoreOpen,
  }),
} as const;
