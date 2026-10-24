import { createHmac, timingSafeEqual } from "node:crypto";

/*
 * Minimal HS256 JSON Web Tokens for the sample backend. A real API brings its own library and keys;
 * this file is deleted with `src/api`.
 */

export type TokenType = "access" | "refresh";

export interface TokenPayload {
  /** Subject: the user id. */
  sub: string;
  type: TokenType;
  /** Issued at and expiry, in seconds since the epoch. */
  iat: number;
  exp: number;
}

const DEV_SECRET = "development-only-secret-change-me";

function secret(): string {
  const value = process.env.AUTH_JWT_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production") throw new Error("AUTH_JWT_SECRET must be set in production");
  return DEV_SECRET;
}

const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
const sign = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

export function signToken(sub: string, type: TokenType, ttlSeconds: number, now = Date.now()): string {
  const iat = Math.floor(now / 1000);
  const body = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub, type, iat, exp: iat + ttlSeconds } satisfies TokenPayload)}`;
  return `${body}.${sign(body)}`;
}

/** The payload when the signature is valid, the type matches and the token has not expired; otherwise `null`. */
export function verifyToken(token: string | undefined, type: TokenType, now = Date.now()): TokenPayload | null {
  const parts = token?.split(".");
  if (!parts || parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expected = Buffer.from(sign(`${header}.${body}`));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as TokenPayload;
    return payload.type === type && typeof payload.sub === "string" && payload.exp > Math.floor(now / 1000) ? payload : null;
  } catch {
    return null;
  }
}
