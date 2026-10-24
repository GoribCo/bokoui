import { Platform } from "react-native";
import { reportError } from "./report-error";

interface RejectionTracker {
  enablePromiseRejectionTracker?: (options: {
    allRejections: boolean;
    onUnhandled: (id: number, error: unknown) => void;
  }) => void;
}

let installed = false;

/**
 * Sends errors nothing else caught (uncaught exceptions, unhandled promise rejections) to `reportError`,
 * then lets the previous handler run, so React Native's red box and crash behavior stay as they were.
 * Call once at startup.
 */
export function installGlobalErrorHandlers(): void {
  if (installed) return;
  installed = true;

  if (Platform.OS === "web") {
    if (typeof window === "undefined") return;
    window.addEventListener("error", (event) => reportError(event.error ?? event.message, { source: "window" }));
    window.addEventListener("unhandledrejection", (event) =>
      reportError(event.reason, { source: "unhandled-rejection" }),
    );
    return;
  }

  const previous = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    reportError(error, { source: "global", fatal: Boolean(isFatal) });
    previous(error, isFatal);
  });

  // Hermes exposes its own promise rejection tracker.
  const hermes = (globalThis as { HermesInternal?: RejectionTracker }).HermesInternal;
  hermes?.enablePromiseRejectionTracker?.({
    allRejections: true,
    onUnhandled: (_id, error) => reportError(error, { source: "unhandled-rejection" }),
  });
}
