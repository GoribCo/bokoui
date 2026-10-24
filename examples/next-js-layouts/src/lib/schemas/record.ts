import { z } from "zod";

export const recordSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  department: z.string(),
  status: z.enum(["active", "archived"]),
  updated: z.string(),
});
