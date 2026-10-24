/** Query keys shared by the hooks, so cached data lines up. */
export const queryKeys = {
  session: ["session"] as const,
  organizations: ["organizations"] as const,
  menu: (organizationId: string) => ["menu", organizationId] as const,
  commonMenu: ["menu", "common"] as const,
  profile: ["profile"] as const,
  publicOrganizations: ["public-organizations"] as const,
  publicOrganization: (type: string, slug: string) => ["public-organizations", type, slug] as const,
  notifications: ["notifications"] as const,
  search: (scope: string, q: string) => ["search", scope, q] as const,
};
