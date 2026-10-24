import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import type { Size } from "../types";

/** Rotating icon. Reduced motion swaps the spin for a slow pulse. */
export const spinnerVariants = cva("inline-block shrink-0 animate-spin text-(--tone-ink) motion-reduce:animate-pulse", {
  variants: {
    size: { sm: "size-4", md: "size-6", lg: "size-8" },
  },
  defaultVariants: { size: "md" },
});

export interface SpinnerStyleProps {
  size?: Size;
}

export function spinnerClass({ size }: SpinnerStyleProps, className?: ClassValue) {
  return cn(spinnerVariants({ size }), className);
}
