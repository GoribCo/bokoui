import { z } from "zod";

/**
 * Shared by the sign-in form (client) and the sign-in action (server) (FR-9.5).
 * Messages are keys of the `auth` message catalog, translated where they are shown.
 */
export const signInSchema = z.object({
  email: z.email({ error: "invalidEmail" }),
  password: z.string().min(1, { error: "passwordRequired" }),
});

export type SignInValues = z.infer<typeof signInSchema>;

/** The user an API answers with after signing in. */
export const signedInUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
});

/** Access and refresh token the API issues; the app keeps them in `lib/auth/token-storage.ts`. */
export const tokenPairSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export type TokenPair = z.infer<typeof tokenPairSchema>;

/** Answer of `POST /auth/login`: the user plus the token pair (there are no cookies on mobile). */
export const signInResultSchema = signedInUserSchema.extend({ tokens: tokenPairSchema });

export const refreshRequestSchema = z.object({ refreshToken: z.string().min(1) });
export const logoutRequestSchema = z.object({ refreshToken: z.string().optional() });
