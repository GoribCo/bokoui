import NetInfo from "@react-native-community/netinfo";
import { focusManager, onlineManager } from "@tanstack/react-query";
import { AppState, Platform } from "react-native";

let connected = false;

/**
 * Connects TanStack Query to the device: "focus" is the app coming back to the foreground, "online" is
 * the network state from NetInfo. Safe to call more than once. Without this a query never refetches on
 * return to the app and keeps trying while offline.
 */
export function connectQueryManagers(): void {
  if (connected) return;
  connected = true;

  onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => setOnline(state.isConnected !== false)),
  );

  if (Platform.OS !== "web") {
    // On the web the library already listens to `visibilitychange`.
    focusManager.setEventListener((handleFocus) => {
      const subscription = AppState.addEventListener("change", (status) => handleFocus(status === "active"));
      return () => subscription.remove();
    });
  }
}
