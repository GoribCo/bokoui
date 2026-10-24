import { logoutRequestSchema, refreshRequestSchema, signInSchema } from "@/lib/schemas";
import { issueTokens, verifyToken } from "../auth";
import { profileFor, userIdForEmail } from "../data/organizations";
import { HttpError, type ApiHandler } from "../types";

/** POST /auth/login with `{ email, password }`. The sample API accepts any well-formed credentials. */
export const login: ApiHandler = (context) => {
  const parsed = signInSchema.safeParse(context.body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new HttpError(422, issue?.message ?? "Invalid credentials", "VALIDATION", issue?.path.join("."));
  }
  const userId = userIdForEmail(parsed.data.email);
  return { results: { id: userId, name: profileFor(userId).name, email: parsed.data.email, tokens: issueTokens(userId) } };
};

/** POST /auth/refresh with `{ refreshToken }`: swaps a valid refresh token for a new pair (the refresh token rotates). */
export const refresh: ApiHandler = (context) => {
  const parsed = refreshRequestSchema.safeParse(context.body);
  const payload = parsed.success ? verifyToken(parsed.data.refreshToken, "refresh") : null;
  if (!payload) throw new HttpError(401, "Session expired", "UNAUTHENTICATED");
  return { results: issueTokens(payload.sub) };
};

/** POST /auth/logout: always succeeds; the client discards its tokens. */
export const logout: ApiHandler = (context) => {
  logoutRequestSchema.safeParse(context.body);
  return { results: null };
};
