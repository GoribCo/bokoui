import type { IconName } from "@/lib/types";
import { fallbackMenuIcon, menuIcons } from "./menu-icons";

/** Renders the registry icon for `name`; a dot when the name is unknown, so the collapsed rail stays readable. */
export function MenuIcon({ name }: { name?: IconName }) {
  const Icon = (name && menuIcons[name]) || fallbackMenuIcon;
  return <Icon aria-hidden="true" />;
}
