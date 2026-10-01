"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import { isApiError } from "@/lib/api/errors";

// Development only: the panel is never part of a production bundle.
const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@tanstack/react-query-devtools").then((module) => module.ReactQueryDevtools), { ssr: false })
    : () => null;

/** Statuses where asking again cannot help: not signed in, not allowed, not there, rejected input. */
const NO_RETRY_STATUSES = [401, 403, 404, 422];

/**
 * Defaults for every query, set once; a hook overrides one only with a reason (see `use-notifications.ts`).
 * - `staleTime` 60 s: data the server just rendered is not refetched at once on the client.
 * - `retry`: up to 2 more tries for network and server errors, none for answers that will not change.
 * - `refetchOnWindowFocus` off: only the session and notifications opt in, because they change without the user.
 * - mutations never retry: repeating a write is not safe by default.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failures, error) =>
          failures < 2 && !NO_RETRY_STATUSES.some((status) => isApiError(error, status)),
      },
      mutations: { retry: false },
    },
  });
}

/** One QueryClient per browser session; created once per mount so requests never share a cache on the server. */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(makeQueryClient);
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
