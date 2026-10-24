"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createRoleStore, type RoleState, type RoleStore, type RoleStoreApi } from "@/lib/stores/role-store";

const RoleStoreContext = createContext<RoleStoreApi | null>(null);

export function RoleStoreProvider({ initial, children }: { initial: RoleState; children: ReactNode }) {
  const [store] = useState(() => createRoleStore(initial));
  return <RoleStoreContext.Provider value={store}>{children}</RoleStoreContext.Provider>;
}

export function useRoleStore<T>(selector: (state: RoleStore) => T): T {
  const store = useContext(RoleStoreContext);
  if (!store) throw new Error("useRoleStore must be used inside RoleStoreProvider");
  return useStore(store, selector);
}
