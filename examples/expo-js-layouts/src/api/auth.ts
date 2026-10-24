import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS } from "@/lib/config/auth";
import type { TokenPair } from "@/lib/schemas";
import { HttpError, type ApiContext } from "./types";

/*
 * Sample tokens: base64 JSON with a user id, a type and an expiry. They are not signed, because they only
 * exist to exercise the sign-in, refresh and expiry flows against the in-process API. A real API issues
 * real JWTs; this file is deleted with `src/api`.
 */

export type TokenType = "access" | "refresh";

interface TokenPayload {
  /** Subject: the user id. */
  sub: string;
  type: TokenType;
  /** Expiry in milliseconds since the epoch. */
  exp: number;
  /** Makes every issued token unique, so a rotated refresh token differs from the old one. */
  nonce: number;
}

let counter = 0;

export function signToken(sub: string, type: TokenType, ttlSeconds: number, now = Date.now()): string {
  counter += 1;
  const payload: TokenPayload = { sub, type, exp: now + ttlSeconds * 1000, nonce: counter };
  return `sample.${btoa(JSON.stringify(payload))}`;
}

/** The payload when the token is well formed, of this type and unexpired; otherwise `null`. */
export function verifyToken(token: string | null | undefined, type: TokenType, now = Date.now()): TokenPayload | null {
  if (!token?.startsWith("sample.")) return null;
  try {
    const payload = JSON.parse(atob(token.slice("sample.".length))) as TokenPayload;
    return payload.type === type && typeof payload.sub === "string" && payload.exp > now ? payload : null;
  } catch {
    return null;
  }
}

/** A fresh access and refresh token for a user. */
export function issueTokens(userId: string): TokenPair {
  return {
    accessToken: signToken(userId, "access", ACCESS_TOKEN_TTL_SECONDS),
    refreshToken: signToken(userId, "refresh", REFRESH_TOKEN_TTL_SECONDS),
  };
}

/** Guard for protected endpoints: 401 without a valid access token. Returns the user id. */
export function requireSession(context: ApiContext): string {
  const payload = verifyToken(context.accessToken, "access");
  if (!payload) throw new HttpError(401, "Sign in to continue", "UNAUTHENTICATED");
  return payload.sub;
}
