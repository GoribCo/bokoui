import { useSessionExpiry } from "@/hooks/use-auth";

/** Renders nothing; keeps the "session expired" handler registered while the app is mounted. */
export function SessionExpiry() {
  useSessionExpiry();
  return null;
}
