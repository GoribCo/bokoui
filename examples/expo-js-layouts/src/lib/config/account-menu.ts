import type { MenuItem } from "@/lib/types";

/** Entries of the account menu above Log out (which is an injected handler, not a link). */
export const accountMenuItems: MenuItem[] = [
  { id: "manage-account", label: "Manage account", labelKey: "account.manage", icon: "settings", href: "/account" },
  { id: "view-profile", label: "View profile", labelKey: "account.profile", icon: "user", href: "/profile" },
];
