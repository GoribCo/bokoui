"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import {
  createOrganizationStore,
  type OrganizationState,
  type OrganizationStore,
  type OrganizationStoreApi,
} from "@/stores/organization-store";

const OrganizationStoreContext = createContext<OrganizationStoreApi | null>(null);

export function OrganizationStoreProvider({
  initial,
  children,
}: {
  initial: OrganizationState;
  children: ReactNode;
}) {
  const [store] = useState(() => createOrganizationStore(initial));
  return <OrganizationStoreContext.Provider value={store}>{children}</OrganizationStoreContext.Provider>;
}

export function useOrganizationStore<T>(selector: (state: OrganizationStore) => T): T {
  const store = useContext(OrganizationStoreContext);
  if (!store) throw new Error("useOrganizationStore must be used inside OrganizationStoreProvider");
  return useStore(store, selector);
}
