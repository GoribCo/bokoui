import type { Instrumentation } from "next";
import { reportError } from "@/lib/monitoring/report-error";

/** Server errors (rendering, route handlers, server actions) go to the same reporter as the browser's. */
export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
  reportError(error, {
    source: "server-request",
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
    digest: typeof error === "object" && error !== null && "digest" in error ? String(error.digest) : undefined,
  });
};
