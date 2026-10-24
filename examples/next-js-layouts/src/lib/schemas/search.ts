import { z } from "zod";

/** One search hit. Without `href` the row is shown but not clickable. */
export const searchResultSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  href: z.string().optional(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;
