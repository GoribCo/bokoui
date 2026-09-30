import { z } from "zod";

export const roleSchema = z.string().min(1);
