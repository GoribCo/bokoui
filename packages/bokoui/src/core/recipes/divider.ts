import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";

export type DividerOrientation = "horizontal" | "vertical";


/** A plain rule (no label). Vertical dividers stretch to the height of a flex row. */
export const dividerVariants = cva("shrink-0 border-0 bg-transparent", {
  variants: {
    orientation: {
      horizontal: `w-full border-t-[length:var(--bokoui-border-width)] border-border`,
      vertical: `h-auto min-h-4 self-stretch border-s-[length:var(--bokoui-border-width)] border-border`,
    },
  },
  defaultVariants: { orientation: "horizontal" },
});

export function dividerClass(orientation?: DividerOrientation, className?: ClassValue) {
  return cn(dividerVariants({ orientation }), className);
}

/** Wrapper for a divider with a centered label; the lines are drawn by `dividerLineClass`. */
export const dividerLabelledClass = (className?: ClassValue) =>
  cn("flex w-full items-center gap-3 font-ui text-sm text-muted-foreground", className);

export const dividerLineClass = cn("flex-1 border-t-[length:var(--bokoui-border-width)] border-border");
