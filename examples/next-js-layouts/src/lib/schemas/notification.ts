import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["action", "info", "success", "invitation"]),
  urgent: z.boolean().optional(),
  title: z.string().min(1),
  body: z.string(),
  time: z.string(),
  unread: z.boolean(),
  href: z.string().optional(),
});
