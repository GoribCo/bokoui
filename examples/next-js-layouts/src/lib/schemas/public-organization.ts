import { z } from "zod";
import { organizationTypeSchema } from "./organization";

const detailsSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hospital"),
    beds: z.number(),
    departments: z.array(z.string()),
    emergency: z.boolean(),
  }),
  z.object({ type: z.literal("pharmacy"), licenseNo: z.string(), open24h: z.boolean(), delivery: z.boolean() }),
  z.object({ type: z.literal("company"), industry: z.string(), employees: z.number(), founded: z.number() }),
]);

export const publicOrganizationSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  logoUrl: z.string().optional(),
  type: organizationTypeSchema,
  description: z.string(),
  city: z.string(),
  phone: z.string().optional(),
  website: z.string().optional(),
  details: detailsSchema,
});
