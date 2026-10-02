import type { MenuItem } from "@/lib/types";

/** Bottom menu shared by every organization. */
export const commonMenu: MenuItem[] = [
  { id: "help", label: "Help", labelKey: "common.help", icon: "help-circle", href: "/help" },
  { id: "terms", label: "Terms", labelKey: "common.terms", icon: "file-text", href: "/legal/terms" },
  {
    id: "privacy-settings",
    label: "Privacy settings",
    labelKey: "common.privacySettings",
    icon: "lock",
    href: "/settings/privacy",
  },
];
