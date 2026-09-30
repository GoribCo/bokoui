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
