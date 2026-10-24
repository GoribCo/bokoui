import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import type { Size } from "../types";
import { toneSolidClass } from "./shared";

export type BadgeVariant = "solid" | "soft" | "outline";

/** Small status label. Colors come from `data-tone`, like Button. */
export const badgeVariants = cva(
  [
    "inline-flex shrink-0 items-center gap-1 whitespace-nowrap select-none",
    "rounded-button border-[length:var(--bokoui-border-width)]",
    "font-ui [font-weight:var(--bokoui-btn-weight)] [text-transform:var(--bokoui-btn-transform)] [letter-spacing:var(--bokoui-btn-tracking)]",
    "[&_svg]:size-[1em] [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        solid: toneSolidClass,
        soft: "border-transparent bg-(--tone-soft) text-(--tone-ink)",
        outline: "border-(--tone-ink) bg-transparent text-(--tone-ink)",
      },
      size: {
        sm: "h-5 px-1.5 text-xs",
        md: "h-6 px-2 text-xs",
        lg: "h-7 px-2.5 text-sm",
      },
    },
    defaultVariants: { variant: "soft", size: "md" },
  },
);

export interface BadgeStyleProps {
  variant?: BadgeVariant;
  size?: Size;
}

export function badgeClass({ variant, size }: BadgeStyleProps, className?: ClassValue) {
  return cn(badgeVariants({ variant, size }), className);
}
