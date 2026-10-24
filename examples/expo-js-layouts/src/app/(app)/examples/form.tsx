import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, FormField, Input, Select, Textarea, useToast } from "bokoui/expo/ui";
import { DatePicker } from "bokoui/expo/blocks";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { useScreenTitle } from "@/components/layout/screen-title";
import { useLocale } from "@/hooks/use-locale";
import { staffSchema, type StaffValues } from "@/lib/schemas/staff";

const roles = ["doctor", "nurse", "pharmacist", "manager"];

export default function FormScreen() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { toast } = useToast();
  useScreenTitle(t("examples.formTitle"));
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffValues>({ resolver: zodResolver(staffSchema), defaultValues: { name: "", email: "", role: "", notes: "", notify: true } });

  const message = (key: string | undefined) => (key ? t(`examples.${key}`) : undefined);

  const onSubmit = (values: StaffValues) => {
    toast({ title: t("examples.savedTitle"), description: t("examples.savedBody", { name: values.name }), action: "success" });
    reset();
  };

  return (
    <PageContainer size="sm">
      <PageHeader title={t("examples.formTitle")} description={t("examples.formDescription")} />
      <View style={{ gap: 16 }}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <FormField label={t("examples.fieldName")} required error={message(errors.name?.message)}>
              <Input value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} autoComplete="name" />
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <FormField label={t("examples.fieldEmail")} required error={message(errors.email?.message)}>
              <Input value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <FormField label={t("examples.fieldRole")} required error={message(errors.role?.message)}>
              <Select
                options={roles.map((role) => ({ value: role, label: role }))}
                value={field.value || undefined}
                onValueChange={field.onChange}
                placeholder={t("examples.pickRole")}
                invalid={Boolean(errors.role)}
              />
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <FormField label={t("examples.fieldStart")} required error={message(errors.startDate?.message)}>
              <DatePicker value={field.value ?? null} onValueChange={field.onChange} locale={locale} placeholder={t("examples.pickDate")} title={t("examples.pickDate")} invalid={Boolean(errors.startDate)} />
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <FormField label={t("examples.fieldNotes")} error={message(errors.notes?.message)}>
              <Textarea value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} />
            </FormField>
          )}
        />
        <Controller control={control} name="notify" render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} label={t("examples.fieldNotify")} />} />
        <Button loading={isSubmitting} onPress={handleSubmit(onSubmit)}>
          {t("examples.save")}
        </Button>
      </View>
    </PageContainer>
  );
}
