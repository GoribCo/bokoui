import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

/** AsyncStorage key that remembers the collapsed sidebar of wide screens. */
export const SIDEBAR_STORAGE_KEY = "bokoui-layouts:sidebar-collapsed";

export interface UiState {
  sidebarCollapsed: boolean;
  drawerOpen: boolean;
  bottomNavMoreOpen: boolean;
}

export interface UiActions {
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setDrawerOpen: (open: boolean) => void;
  setBottomNavMoreOpen: (open: boolean) => void;
}

export type UiStore = UiState & UiActions;

export const defaultUiState: UiState = {
  sidebarCollapsed: false,
  drawerOpen: false,
  bottomNavMoreOpen: false,
};

/** Vanilla store factory. Only `sidebarCollapsed` is persisted; overlays always start closed. */
export function createUiStore(initial: Partial<UiState> = {}) {
  return createStore<UiStore>()(
    persist(
      (set) => ({
        ...defaultUiState,
        ...initial,
        setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
        toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
        setBottomNavMoreOpen: (bottomNavMoreOpen) => set({ bottomNavMoreOpen }),
      }),
      {
        name: SIDEBAR_STORAGE_KEY,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: ({ sidebarCollapsed }) => ({ sidebarCollapsed }),
      },
    ),
  );
}

export type UiStoreApi = ReturnType<typeof createUiStore>;

/** The app's store; `hooks`/providers read it through `useUiStore`. */
export const uiStore = createUiStore();

/** Typed selectors: components subscribe to one field, not the whole store. */
export const uiSelectors = {
  sidebarCollapsed: (state: UiStore) => state.sidebarCollapsed,
  drawerOpen: (state: UiStore) => state.drawerOpen,
  bottomNavMoreOpen: (state: UiStore) => state.bottomNavMoreOpen,
  actions: (state: UiStore) => ({
    setSidebarCollapsed: state.setSidebarCollapsed,
    toggleSidebar: state.toggleSidebar,
    setDrawerOpen: state.setDrawerOpen,
    setBottomNavMoreOpen: state.setBottomNavMoreOpen,
  }),
} as const;
