import { sampleTransport } from "@/api/transport";
import { tokenStorage } from "@/lib/auth/token-storage";
import { ApiClient, createFetchTransport } from "./client";

/**
 * Where the API lives. Set `EXPO_PUBLIC_API_BASE_URL` to the real server (e.g. `https://api.example.com/v1`);
 * without it the app talks to the in-process sample API in `src/api`. Deleting that folder means removing
 * the import above and the fallback below.
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const apiClient = new ApiClient({
  transport: API_BASE_URL ? createFetchTransport(API_BASE_URL) : sampleTransport,
  tokens: tokenStorage,
});
