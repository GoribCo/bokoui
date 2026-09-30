"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SIGN_IN_PATH } from "@/config/auth";
import { signInSchema, type SignInValues } from "@/schemas";
import { safeReturnPath } from "./paths";

/** Ends the mock session and returns to the sign-in page. The real project replaces this with its auth provider. */
export async function signOut(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect(SIGN_IN_PATH);
}

export type SignInResult = { ok: false; fieldErrors: Partial<Record<keyof SignInValues, string>> };

/**
 * Mock sign-in: any well-formed credentials open a session. Validation uses the same schema as the form;
 * on success it redirects and never returns.
 */
export async function signIn(values: unknown, returnTo?: string): Promise<SignInResult> {
  const parsed = signInSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: SignInResult["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "email" || field === "password") fieldErrors[field] ??= issue.message;
    }
    return { ok: false, fieldErrors };
  }

  (await cookies()).set(SESSION_COOKIE, "mock-session", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  redirect(safeReturnPath(returnTo));
}
