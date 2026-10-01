import { ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_TTL_SECONDS } from "@/lib/config/auth";
import { signInSchema } from "@/lib/schemas/auth";
import { profileFor, userIdForEmail } from "../data/organizations";
import { signToken, verifyToken } from "../jwt";
import { HttpError, type ApiCookie, type ApiHandler } from "../types";

const issueTokens = (userId: string): ApiCookie[] => [
  { name: ACCESS_TOKEN_COOKIE, value: signToken(userId, "access", ACCESS_TOKEN_TTL_SECONDS), maxAge: ACCESS_TOKEN_TTL_SECONDS },
  { name: REFRESH_TOKEN_COOKIE, value: signToken(userId, "refresh", REFRESH_TOKEN_TTL_SECONDS), maxAge: REFRESH_TOKEN_TTL_SECONDS },
];

/** POST /auth/login with `{ email, password }`. The sample backend accepts any well-formed credentials. */
export const login: ApiHandler = (context) => {
  const parsed = signInSchema.safeParse(context.body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new HttpError(422, issue?.message ?? "Invalid credentials", "VALIDATION", issue?.path.join("."));
  }
  const userId = userIdForEmail(parsed.data.email);
  return { results: { id: userId, name: profileFor(userId).name, email: parsed.data.email }, cookies: issueTokens(userId) };
};

/** POST /auth/refresh: swaps a valid refresh token for a new pair (the refresh token rotates). */
export const refresh: ApiHandler = (context) => {
  const payload = verifyToken(context.cookies[REFRESH_TOKEN_COOKIE], "refresh");
  if (!payload) throw new HttpError(401, "Session expired", "UNAUTHENTICATED");
  return { results: null, cookies: issueTokens(payload.sub) };
};

/** POST /auth/logout: clears both cookies. Always succeeds. */
export const logout: ApiHandler = () => ({
  results: null,
  cookies: [ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE].map((name) => ({ name, value: "", maxAge: 0 })),
});
