"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, Card, CardHeader, FormField, Heading, Input, Text } from "bokoui/react";
import { useLogin } from "@/hooks/use-auth";
import { isApiError } from "@/lib/api/errors";
import { signInSchema, type SignInValues } from "@/lib/schemas";

export interface SignInFormProps {
  /** Page to open after signing in; sanitized again on the server. */
  returnTo?: string;
}

/** Sign-in form: React Hook Form with the Zod schema shared with the API (FR-9.5). */
export function SignInForm({ returnTo }: SignInFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema), defaultValues: { email: "", password: "" } });

  // Schema messages are catalog keys ("invalidEmail", "passwordRequired").
  const message = (key: string | undefined) =>
    key === "invalidEmail" || key === "passwordRequired" ? t(key) : undefined;

  const onSubmit = (values: SignInValues) =>
    login.mutate(values, {
      onSuccess: () => {
        router.replace(returnTo ?? "/");
        router.refresh();
      },
      onError: (error) => {
        // The server rejected a field: show its message under that field; anything else under the form.
        if (isApiError(error, 422) && (error.field === "email" || error.field === "password")) {
          setError(error.field, { message: error.message });
        } else {
          setError("root", { message: "failed" });
        }
      },
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
        {errors.root ? (
          <Text role="alert" className="text-danger">
            {t("failed")}
          </Text>
        ) : null}
        <Button type="submit" loading={login.isPending} fullWidth>
          {t("submit")}
        </Button>
      </form>
    </Card>
  );
}
