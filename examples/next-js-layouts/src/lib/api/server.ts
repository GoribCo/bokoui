import "server-only";
import { cookies, headers } from "next/headers";
import { API_BASE_URL, ApiClient } from "./client";

async function resolveBaseUrl(): Promise<string> {
  // A configured absolute URL (a real backend) is used as is.
  if (/^https?:\/\//.test(API_BASE_URL)) return API_BASE_URL;
  // Otherwise the sample backend runs inside this app: call it on the host that received the request.
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}${API_BASE_URL}`;
}

/**
 * Client for Server Components, layouts and route files. It forwards the visitor's cookies so the API
 * sees the same session. Pass `withCookies: false` for public data that is cached across visitors.
 */
export async function getServerApi({ withCookies = true }: { withCookies?: boolean } = {}): Promise<ApiClient> {
  const baseUrl = await resolveBaseUrl();
  const cookie = withCookies ? (await cookies()).toString() : "";
  return new ApiClient({ baseUrl, headers: (): Record<string, string> => (cookie ? { cookie } : {}) });
}
