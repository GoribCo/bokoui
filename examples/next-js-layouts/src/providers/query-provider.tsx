"use client";

import { QueryClient, QueryClientProvider } from "@/lib/query/react-query";
import { useState, type ReactNode } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // Avoids an immediate refetch on the client of data the server just rendered.
      queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false },
    },
  });
}

/** One QueryClient per browser session; created once per mount so requests never share a cache on the server. */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(makeQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
