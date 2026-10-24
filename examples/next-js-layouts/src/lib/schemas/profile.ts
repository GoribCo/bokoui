import { z } from "zod";
import { userSchema } from "./session";

export const profileSchema = userSchema.extend({
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  joinedAt: z.string().min(1),
});
