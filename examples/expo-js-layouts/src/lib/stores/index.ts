import { useState, useEffect } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { organizationStore, type OrganizationStore } from "./organization-store";
import { roleStore, type RoleStore } from "./role-store";
import { uiSelectors, uiStore, type UiStore } from "./ui-store";

export * from "./organization-store";
export * from "./role-store";
export * from "./ui-store";

/** Hooks over the three persisted stores: `useUiStore(uiSelectors.drawerOpen)`. */
export const useUiStore = <T>(selector: (state: UiStore) => T): T => useStore(uiStore, selector);
/** The UI store's actions as one object; `useShallow` keeps it stable (a fresh object each time would loop). */
export const useUiActions = () => useStore(uiStore, useShallow(uiSelectors.actions));
export const useOrganizationStore = <T>(selector: (state: OrganizationStore) => T): T =>
  useStore(organizationStore, selector);
export const useRoleStore = <T>(selector: (state: RoleStore) => T): T => useStore(roleStore, selector);

const stores = [uiStore, organizationStore, roleStore] as const;

const allHydrated = () => stores.every((store) => store.persist.hasHydrated());

/**
 * True once every persisted store has read its saved value from AsyncStorage. The splash gate waits for it,
 * so the first frame already shows the remembered sidebar, organization and role.
 */
export function useStoresHydrated(): boolean {
  const [hydrated, setHydrated] = useState(allHydrated);
  useEffect(() => {
    const update = () => setHydrated(allHydrated());
    const unsubscribe = stores.map((store) => store.persist.onFinishHydration(update));
    update();
    return () => unsubscribe.forEach((off) => off());
  }, []);
  return hydrated;
}
