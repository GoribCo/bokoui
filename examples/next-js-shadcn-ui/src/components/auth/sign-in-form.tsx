"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth/actions";
import { signInSchema, type SignInValues } from "@/lib/schemas";

export interface SignInFormProps {
  /** Page to open after signing in; sanitized again on the server. */
  returnTo?: string;
}

/** Sign-in form: React Hook Form with the Zod schema shared with the server action (FR-9.5). */
export function SignInForm({ returnTo }: SignInFormProps) {
  const t = useTranslations("auth");
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema), defaultValues: { email: "", password: "" } });

  // Schema messages are catalog keys ("invalidEmail", "passwordRequired").
  const message = (key: string | undefined) => (key === "invalidEmail" || key === "passwordRequired" ? t(key) : undefined);

  const onSubmit = (values: SignInValues) =>
    startTransition(async () => {
      const result = await signIn(values, returnTo);
      // Only reached when the server rejected the values; success redirects.
      for (const [field, key] of Object.entries(result.fieldErrors)) {
        if (field === "email" || field === "password") setError(field, { message: key });
      }
    });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <h1 className="text-lg">{t("title")}</h1>
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.email) || undefined}>
              <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              <FieldError>{message(errors.email?.message)}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors.password) || undefined}>
              <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              <FieldError>{message(errors.password?.message)}</FieldError>
            </Field>
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? <Loader2 aria-hidden="true" className="animate-spin" /> : null}
              {t("submit")}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
