import { Button, type ButtonProps } from "bokoui/expo/ui";
import type { ReactNode } from "react";

export interface IconButtonProps extends Omit<ButtonProps, "children" | "iconOnly" | "leftIcon" | "rightIcon"> {
  icon: ReactNode;
  /** Accessible name: an icon alone says nothing to a screen reader. */
  label: string;
}

/** A 44 pt square button that shows an icon only. */
export function IconButton({ icon, label, variant = "ghost", color = "neutral", ...props }: IconButtonProps) {
  return <Button iconOnly variant={variant} color={color} accessibilityLabel={label} leftIcon={icon} {...props} />;
}
