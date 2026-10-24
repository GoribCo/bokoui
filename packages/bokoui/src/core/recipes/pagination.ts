import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import type { Size } from "../types";
import { inlineSvgClass } from "./shared";

export const paginationClass = (className?: ClassValue) => cn("flex items-center", className);
export const paginationListClass = "flex flex-wrap items-center gap-1";

/** Current page comes from `aria-current="page"`, so no extra prop is needed. */
export const pageButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center select-none font-ui tabular-nums",
    "rounded-button border-[length:var(--bokoui-border-width)] border-transparent text-foreground",
    "transition-[background-color,border-color,color] duration-(--bokoui-duration) ease-ui focus-ring",
    inlineSvgClass,
    "enabled:hover:bg-(--tone-soft) aria-[current=page]:border-(--tone-border) aria-[current=page]:bg-(--tone) aria-[current=page]:text-(--tone-fg)",
    "aria-disabled:pointer-events-none aria-disabled:opacity-(--bokoui-disabled-opacity) disabled:cursor-not-allowed disabled:opacity-(--bokoui-disabled-opacity)",
    "pointer-coarse:min-h-11 pointer-coarse:min-w-11",
  ],
  {
    variants: { size: { sm: "h-8 min-w-8 px-2 text-sm", md: "h-10 min-w-10 px-3 text-sm", lg: "h-12 min-w-12 px-4 text-base" } },
    defaultVariants: { size: "md" },
  },
);

export interface PaginationStyleProps {
  size?: Size;
}

export const pageButtonClass = ({ size }: PaginationStyleProps, className?: ClassValue) =>
  cn(pageButtonVariants({ size }), className);

export const pageEllipsisClass = "inline-flex size-8 items-center justify-center text-muted-foreground [&_svg]:size-4";
