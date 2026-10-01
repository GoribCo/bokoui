"use client";

import { Menu } from "lucide-react";
import { Button } from "bokoui/react";

export interface MobileMenuButtonProps {
  label: string;
  expanded: boolean;
  onClick: () => void;
}

/** Hamburger at the left of the mobile header; opens the drawer (FR-6.3). */
export function MobileMenuButton({
  label,
  expanded,
  onClick,
}: MobileMenuButtonProps) {
  return (
    <Button
      variant="ghost"
      color="neutral"
      iconOnly
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      onClick={onClick}
    >
      <Menu aria-hidden="true" />
    </Button>
  );
}
