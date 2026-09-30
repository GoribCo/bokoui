import type { Role } from "./role";

/** Key into the icon registry; a string so menus can come from JSON or an API. */
export type IconName = string;

/** Node in the navigation tree: a link, a group of children, or both. Depth is unbounded. */
export interface MenuItem {
  id: string;
  /** Fallback text, used when `labelKey` is missing or has no translation. */
  label: string;
  /** Translation key in the message catalogs. */
  labelKey?: string;
  icon?: IconName;
  href?: string;
  children?: MenuItem[];
  badge?: string | number;
  /** Item is visible when the user holds any of these roles; no value means everyone. */
  requiredRoles?: Role[];
}

/** Labeled section of the main navigation. */
export interface MenuGroup {
  id: string;
  label: string;
  labelKey?: string;
  items: MenuItem[];
  requiredRoles?: Role[];
}
