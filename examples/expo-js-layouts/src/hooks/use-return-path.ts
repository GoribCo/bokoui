import { usePathname } from "expo-router";
import { Platform } from "react-native";

/**
 * The screen the user is on, to come back to after signing in. On the web the address bar is the truth
 * (the router can still report "/" during the very first render of a reload), so it wins there.
 */
export function useReturnPath(): string {
  const pathname = usePathname();
  if (Platform.OS === "web" && typeof window !== "undefined") return `${window.location.pathname}${window.location.search}`;
  return pathname;
}
