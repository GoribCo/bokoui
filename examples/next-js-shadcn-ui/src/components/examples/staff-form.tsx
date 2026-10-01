"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CircleCheck, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { staffSchema, type StaffValues } from "@/lib/schemas/staff";

/** Sample form: React Hook Form + Zod, no network. */
export function StaffForm() {
  const [saved, setSaved] = useState<StaffValues | null>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: { name: "", email: "", notes: "", notify: true },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setSaved(values);
        reset();
      })}
    >
      <FieldGroup>
        {saved ? (
          <Alert>
            <CircleCheck aria-hidden="true" />
            <AlertDescription>Saved {saved.name}.</AlertDescription>
          </Alert>
        ) : null}
        <Field data-invalid={Boolean(errors.name) || undefined}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" autoComplete="name" required aria-invalid={Boolean(errors.name)} {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>
        <Field data-invalid={Boolean(errors.email) || undefined}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>
        <Field data-invalid={Boolean(errors.notes) || undefined}>
          <FieldLabel htmlFor="notes">Notes</FieldLabel>
          <Textarea id="notes" rows={4} aria-invalid={Boolean(errors.notes)} {...register("notes")} />
          <FieldDescription>Optional, up to 200 characters.</FieldDescription>
          <FieldError>{errors.notes?.message}</FieldError>
        </Field>
        <Controller
          control={control}
          name="notify"
          render={({ field }) => (
            <Field orientation="horizontal">
              <Checkbox id="notify" checked={field.value} onCheckedChange={(value) => field.onChange(value === true)} />
              <FieldLabel htmlFor="notify">Send a welcome email</FieldLabel>
            </Field>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 aria-hidden="true" className="animate-spin" /> : null}
            Save
          </Button>
          <Button type="reset" variant="ghost" onClick={() => reset()}>
            Reset
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
