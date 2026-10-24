import { z } from "zod";

/** The `meta` block of every list answer. */
export const pageMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalPages: z.number().int().positive(),
});

export type PageMeta = z.infer<typeof pageMetaSchema>;

/**
 * Query-string convention of every list endpoint: `page` (1-based), `pageSize`, `q` (text search),
 * `status` (filter) and `sort` (`field` or `-field` for descending). An endpoint supports a subset.
 */
export const pageQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  q: z.string().optional(),
  status: z.string().optional(),
  sort: z.string().optional(),
});

export type PageQuery = z.infer<typeof pageQuerySchema>;
