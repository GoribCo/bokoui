/** Query keys shared by the client hooks and server-side prefetching. */
export const queryKeys = {
  organizations: ["organizations"] as const,
  menu: (organizationId: string) => ["menu", organizationId] as const,
};
