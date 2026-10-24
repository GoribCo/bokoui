import { z } from "zod";
import { organizationSchema } from "./organization";

export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
  avatarUrl: z.string().optional(),
});

export const sessionSchema = z
  .object({
    user: userSchema,
    organizations: z.array(organizationSchema),
    defaultOrganizationId: z.string().min(1),
  })
  .refine((s) => s.organizations.some((o) => o.id === s.defaultOrganizationId), {
    message: "defaultOrganizationId must match an organization",
    path: ["defaultOrganizationId"],
  });
