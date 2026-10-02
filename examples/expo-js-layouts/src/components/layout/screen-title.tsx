import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Platform } from "react-native";

interface ScreenTitleContextValue {
  title: string | null;
  setTitle: (title: string | null) => void;
}

const ScreenTitleContext = createContext<ScreenTitleContextValue>({ title: null, setTitle: () => {} });

/** Holds the title the current screen announced; the header shows it when the menu has no entry for the route. */
export function ScreenTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | null>(null);
  const value = useMemo(() => ({ title, setTitle }), [title]);
  return <ScreenTitleContext.Provider value={value}>{children}</ScreenTitleContext.Provider>;
}

/** The title announced by the current screen, or `null`. */
export function useScreenTitleValue(): string | null {
  return useContext(ScreenTitleContext).title;
}

/** Each screen calls this with its title: it shows in the header and, on the web build, in the tab title. */
export function useScreenTitle(title: string): void {
  const { setTitle } = useContext(ScreenTitleContext);
  useEffect(() => {
    setTitle(title);
    if (Platform.OS === "web" && typeof document !== "undefined") document.title = title;
    return () => setTitle(null);
  }, [title, setTitle]);
}
