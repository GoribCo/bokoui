/** Called once when a request fails with 401 and the session cannot be refreshed (the user must sign in again). */
export type SessionExpiredHandler = () => void;

let handler: SessionExpiredHandler | undefined;

/** The app registers one handler (see `useSessionExpiry`); it clears state and sends the user to sign-in. */
export function setSessionExpiredHandler(next: SessionExpiredHandler | undefined) {
  handler = next;
}

export function notifySessionExpired() {
  handler?.();
}
