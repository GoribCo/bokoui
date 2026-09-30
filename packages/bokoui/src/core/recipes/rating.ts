import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import type { Size } from "../types";

export const ratingVariants = cva("inline-flex items-center gap-0.5 text-(--tone)", {
  variants: { size: { sm: "[&_svg]:size-4", md: "[&_svg]:size-5", lg: "[&_svg]:size-7" } },
  defaultVariants: { size: "md" },
});

export interface RatingStyleProps {
  size?: Size;
}

export const ratingClass = ({ size }: RatingStyleProps, className?: ClassValue) => cn(ratingVariants({ size }), className);

/** Star button: hover previews, focus is visible, filled state is drawn by the icon's `fill`. */
export const ratingStarClass = cn(
  "inline-flex rounded-sm text-inherit transition-transform duration-(--bokoui-duration) ease-ui focus-ring",
  "enabled:hover:scale-110 motion-reduce:transition-none disabled:cursor-default",
  "pointer-coarse:min-h-11 pointer-coarse:min-w-9 pointer-coarse:items-center pointer-coarse:justify-center",
);
export const ratingEmptyClass = "text-muted-foreground/40";
