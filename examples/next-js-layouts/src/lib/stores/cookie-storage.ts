import type { StateStorage } from "zustand/middleware";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  const match = document.cookie.split("; ").find((entry) => entry.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

/**
 * zustand `persist` storage backed by a cookie, so the server can read the value and render the
 * right state on first paint (no layout shift). Stores one field of the persisted state as a plain string.
 */
export function createCookieStorage(
  cookieName: string,
  field: string,
  parse: (raw: string) => unknown,
): StateStorage {
  return {
    getItem: () => {
      const raw = readCookie(cookieName);
      return raw === null ? null : JSON.stringify({ state: { [field]: parse(raw) }, version: 0 });
    },
    setItem: (_name, value) => {
      const { state } = JSON.parse(value) as { state: Record<string, unknown> };
      document.cookie = `${cookieName}=${encodeURIComponent(String(state[field]))}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
    },
    removeItem: () => {
      document.cookie = `${cookieName}=; path=/; max-age=0`;
    },
  };
}
