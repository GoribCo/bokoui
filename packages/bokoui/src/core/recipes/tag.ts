import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import type { Size } from "../types";

export type TagVariant = "soft" | "outline" | "solid";

/** A removable, optionally clickable chip. `Badge` is for static status; `Tag` is for user-managed values. */
export const tagVariants = cva(
  [
    "inline-flex max-w-full shrink-0 items-center gap-1 select-none rounded-button font-ui",
    "border-[length:var(--bokoui-border-width)] transition-colors duration-(--bokoui-duration) ease-ui",
    "[&_svg]:size-[1em] [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        soft: "border-transparent bg-(--tone-soft) text-(--tone-ink)",
        outline: "border-(--tone-ink) bg-transparent text-(--tone-ink)",
        solid: "border-(--tone-border) bg-(--tone) text-(--tone-fg)",
      },
      size: { sm: "h-6 pl-2 pr-1 text-xs", md: "h-7 pl-2.5 pr-1.5 text-sm", lg: "h-8 pl-3 pr-2 text-sm" },
      interactive: {
        true: "cursor-pointer focus-ring enabled:hover:brightness-95 aria-pressed:ring-2 aria-pressed:ring-(--tone)",
        false: "",
      },
    },
    defaultVariants: { variant: "soft", size: "md", interactive: false },
  },
);

export interface TagStyleProps {
  variant?: TagVariant;
  size?: Size;
}

export const tagClass = ({ variant, size }: TagStyleProps, interactive: boolean, className?: ClassValue) =>
  cn(tagVariants({ variant, size, interactive }), className);

export const tagRemoveClass = cn(
  "-me-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-current opacity-70",
  "hover:bg-black/10 hover:opacity-100 focus-ring pointer-coarse:size-8 [&_svg]:size-3.5",
);
