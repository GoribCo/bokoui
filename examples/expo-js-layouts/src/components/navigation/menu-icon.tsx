import { useTheme } from "bokoui/expo";
import type { IconName } from "@/lib/types";
import { fallbackMenuIcon, menuIcons } from "./menu-icons";

export interface MenuIconProps {
  name?: IconName;
  size?: number;
  /** Defaults to the theme's foreground color. */
  color?: string;
}

/** Renders the registry icon for `name`; a dot when the name is unknown, so rows stay aligned. */
export function MenuIcon({ name, size = 20, color }: MenuIconProps) {
  const { tokens } = useTheme();
  const Icon = (name && menuIcons[name]) || fallbackMenuIcon;
  return <Icon size={size} color={color ?? tokens.fg} strokeWidth={2} accessibilityElementsHidden importantForAccessibility="no" />;
}
