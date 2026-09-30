"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { createUiStore, type UiState, type UiStore, type UiStoreApi } from "@/lib/stores/ui-store";

const UiStoreContext = createContext<UiStoreApi | null>(null);

export function UiStoreProvider({ initial, children }: { initial?: Partial<UiState>; children: ReactNode }) {
  const [store] = useState(() => createUiStore(initial));
  return <UiStoreContext.Provider value={store}>{children}</UiStoreContext.Provider>;
}

export function useUiStore<T>(selector: (state: UiStore) => T): T {
  const store = useContext(UiStoreContext);
  if (!store) throw new Error("useUiStore must be used inside UiStoreProvider");
  return useStore(store, useShallow(selector));
}
