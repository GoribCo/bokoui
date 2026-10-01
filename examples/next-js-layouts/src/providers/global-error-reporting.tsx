"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/monitoring/report-error";

/** Renders nothing; sends errors that no boundary caught (event handlers, promises) to `reportError`. */
export function GlobalErrorReporting() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => reportError(event.error ?? event.message, { source: "window" });
    const onRejection = (event: PromiseRejectionEvent) => reportError(event.reason, { source: "unhandled-rejection" });
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}
