"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Button, Checkbox, FormField, Input, Textarea } from "bokoui/react";
import { staffSchema, type StaffValues } from "@/lib/schemas/staff";

/** Sample form: React Hook Form + Zod, no network. */
export function StaffForm() {
  const [saved, setSaved] = useState<StaffValues | null>(null);
  const {
    register,
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
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setSaved(values);
        reset();
      })}
    >
      {saved ? <Alert action="success">Saved {saved.name}.</Alert> : null}
      <FormField label="Name" required error={errors.name?.message}>
        <Input autoComplete="name" {...register("name")} />
      </FormField>
      <FormField label="Email" required error={errors.email?.message}>
        <Input type="email" autoComplete="email" {...register("email")} />
      </FormField>
      <FormField label="Notes" hint="Optional, up to 200 characters." error={errors.notes?.message}>
        <Textarea rows={4} {...register("notes")} />
      </FormField>
      <Checkbox label="Send a welcome email" {...register("notify")} />
      <div className="flex gap-2">
        <Button type="submit" loading={isSubmitting}>
          Save
        </Button>
        <Button type="reset" variant="ghost" color="neutral" onClick={() => reset()}>
          Reset
        </Button>
      </div>
    </form>
  );
}
