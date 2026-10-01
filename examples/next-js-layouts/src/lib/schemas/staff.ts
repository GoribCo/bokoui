import { z } from "zod";

/** Sample form schema; its messages are plain text because the demo form is not localized. */
export const staffSchema = z.object({
  name: z.string().min(2, { error: "Enter at least 2 characters" }),
  email: z.email({ error: "Enter a valid email address" }),
  notes: z.string().max(200, { error: "Keep notes under 200 characters" }),
  notify: z.boolean(),
});

export type StaffValues = z.infer<typeof staffSchema>;

/** A staff member as the API returns it. */
export const staffMemberSchema = staffSchema.extend({ id: z.number() });
