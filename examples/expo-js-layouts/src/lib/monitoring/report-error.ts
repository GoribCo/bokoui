/**
 * The one place errors are sent to a monitoring service. Every error boundary, the sample API, the global
 * browser handlers and `instrumentation.ts` call `reportError`; nothing else logs errors on its own.
 * Plug a service in by replacing `reporter` below (Sentry, Datadog, an HTTP endpoint, ...); the default
 * writes to the console.
 */
export interface ErrorContext {
  /** Where it was caught, e.g. "error-boundary", "api", "window", "server-request". */
  source: string;
  /** Anything that helps to find it: a route, a digest, a request id. */
  [key: string]: unknown;
}

export type ErrorReporter = (error: unknown, context: ErrorContext) => void;

const consoleReporter: ErrorReporter = (error, context) => {
  console.error(`[${context.source}]`, error, context);
};

let reporter: ErrorReporter = consoleReporter;

/** Replace the destination of every report (call once at startup). */
export function setErrorReporter(next: ErrorReporter) {
  reporter = next;
}

/** Reports an error. Never throws: a broken reporter must not hide the original problem. */
export function reportError(error: unknown, context: ErrorContext) {
  try {
    reporter(error, context);
  } catch (failure) {
    console.error("The error reporter failed", failure);
    consoleReporter(error, context);
  }
}
