import type { RecordListParams } from "@/lib/services/record.service";

/** Query keys shared by the hooks and by server-side prefetching, so cached data lines up. */
export const queryKeys = {
  session: ["session"] as const,
  organizations: ["organizations"] as const,
  menu: (organizationId: string) => ["menu", organizationId] as const,
  commonMenu: ["menu", "common"] as const,
  profile: ["profile"] as const,
  notifications: ["notifications"] as const,
  records: (params: RecordListParams) => ["records", params] as const,
};
