const maxAge = 60 * 60 * 24 * 7

/** Sample sign-in: any email and password open the demo. The session is a cookie so the server and the browser agree. */
export function useAuth() {
  const session = useCookie<string | null>('boko_session', { default: () => null, maxAge, sameSite: 'lax' })
  return {
    signedIn: computed(() => Boolean(session.value)),
    email: computed(() => session.value),
    signIn: (email: string) => (session.value = email),
    signOut: () => (session.value = null),
  }
}
