import { z } from "zod";

/** Sample form schema. Messages are keys of the `examples` catalog, translated where they are shown. */
export const staffSchema = z.object({
  name: z.string().min(2, { error: "errName" }),
  email: z.email({ error: "errEmail" }),
  role: z.string().min(1, { error: "errRole" }),
  startDate: z.date({ error: "errDate" }),
  notes: z.string().max(200, { error: "errNotes" }),
  notify: z.boolean(),
});

export type StaffValues = z.infer<typeof staffSchema>;
