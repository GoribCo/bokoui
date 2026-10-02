import { forwardRef, type HTMLAttributes } from "react";
import { badgeClass, resolveTone, type Action, type BadgeStyleProps, type Color } from "@/core";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, BadgeStyleProps {
  /** Brand palette slot. Default `primary`. */
  color?: Color;
  /** Semantic intent; overrides `color`. */
  action?: Action;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, size, color = "primary", action, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      data-tone={resolveTone(color, action)}
      className={badgeClass({ variant, size }, className)}
      {...props}
    />
  );
});
