import { z } from "zod";
import { organizationTypeKeys } from "@/lib/organization-types";
import { roleSchema } from "./role";

export const organizationTypeSchema = z.enum(organizationTypeKeys);

export const organizationSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  logoUrl: z.string().optional(),
  type: organizationTypeSchema,
  roles: z.array(roleSchema),
});
