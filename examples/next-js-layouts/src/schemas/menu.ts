import { z } from "zod";
import type { MenuGroup, MenuItem } from "@/types";
import { roleSchema } from "./role";

export const menuItemSchema: z.ZodType<MenuItem> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    labelKey: z.string().optional(),
    icon: z.string().optional(),
    href: z.string().optional(),
    children: z.array(menuItemSchema).optional(),
    badge: z.union([z.string(), z.number()]).optional(),
    requiredRoles: z.array(roleSchema).optional(),
  }),
);

export const menuGroupSchema: z.ZodType<MenuGroup> = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  labelKey: z.string().optional(),
  items: z.array(menuItemSchema),
  requiredRoles: z.array(roleSchema).optional(),
});

export const menuSchema = z.array(menuGroupSchema);
