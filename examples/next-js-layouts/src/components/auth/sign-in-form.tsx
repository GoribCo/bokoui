"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button, Card, CardHeader, FormField, Heading, Input, Text } from "bokoui/react";
import { signIn } from "@/lib/auth/actions";
import { signInSchema, type SignInValues } from "@/schemas";

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
        <Heading as="h1" size="lg">
          {t("title")}
        </Heading>
        <Text muted>{t("description")}</Text>
      </CardHeader>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
        <FormField label={t("email")} required error={message(errors.email?.message)}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </FormField>
        <FormField label={t("password")} required error={message(errors.password?.message)}>
          <Input type="password" autoComplete="current-password" {...register("password")} />
        </FormField>
        <Button type="submit" loading={pending} fullWidth>
          {t("submit")}
        </Button>
      </form>
    </Card>
  );
}
