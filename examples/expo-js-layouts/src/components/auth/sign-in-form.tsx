import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardHeader, Divider, FormField, Heading, Input, Text, useTheme } from "bokoui/expo";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { useLogin } from "@/hooks/use-auth";
import { isApiError } from "@/lib/api/errors";
import { sampleAccounts } from "@/lib/config/auth";
import { toRoute } from "@/lib/menu";
import { signInSchema, type SignInValues } from "@/lib/schemas";

export interface SignInFormProps {
  /** Screen to open after signing in; already sanitized (see `safeReturnPath`). */
  returnTo: string;
}

/** Sign-in form: React Hook Form with the Zod schema shared with the API. */
export function SignInForm({ returnTo }: SignInFormProps) {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const router = useRouter();
  const login = useLogin();
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema), defaultValues: { email: "", password: "" } });

  // Schema messages are catalog keys ("invalidEmail", "passwordRequired").
  const message = (key: string | undefined) => (key === "invalidEmail" || key === "passwordRequired" ? t(`auth.${key}`) : key);

  const onSubmit = (values: SignInValues) =>
    login.mutate(values, {
      onSuccess: () => router.replace(toRoute(returnTo)),
      onError: (error) => {
        // The API rejected a field: show its message under that field; anything else under the form.
        if (isApiError(error, 422) && (error.field === "email" || error.field === "password")) {
          setError(error.field, { message: error.message });
        } else {
          setError("root", { message: "failed" });
        }
      },
    });

  return (
    <View style={{ width: "100%", maxWidth: 400, alignSelf: "center", padding: 16 }}>
      <Card>
        <CardHeader>
          <Heading as="h1" size="lg">
            {t("auth.title")}
          </Heading>
          <Text muted>{t("auth.description")}</Text>
        </CardHeader>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <FormField label={t("auth.email")} required error={message(errors.email?.message)}>
              <Input
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <FormField label={t("auth.password")} required error={message(errors.password?.message)}>
              <Input
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                secureTextEntry
                autoComplete="current-password"
                textContentType="password"
                autoCapitalize="none"
                returnKeyType="go"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            </FormField>
          )}
        />
        {errors.root ? (
          <Text accessibilityRole="alert" style={{ color: tokens.danger }}>
            {t("auth.failed")}
          </Text>
        ) : null}
        <Button loading={login.isPending} fullWidth onPress={handleSubmit(onSubmit)}>
          {t("auth.submit")}
        </Button>
        <Divider label={t("auth.samplesTitle")} />
        <View style={{ gap: 4 }}>
          {sampleAccounts.map((account) => (
            <Pressable
              key={account.email}
              accessibilityRole="button"
              accessibilityLabel={`${account.email}. ${t(`auth.${account.labelKey}`)}`}
              onPress={() => {
                setValue("email", account.email, { shouldValidate: true });
                setValue("password", "demo", { shouldValidate: true });
              }}
              style={({ pressed }) => ({ minHeight: 48, justifyContent: "center", paddingHorizontal: 8, borderRadius: tokens.radiusControl, backgroundColor: pressed ? tokens.muted : "transparent" })}
            >
              <Text variant="small" style={{ fontWeight: "500" }}>
                {account.email}
              </Text>
              <Text variant="caption" muted>
                {t(`auth.${account.labelKey}`)}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>
    </View>
  );
}
