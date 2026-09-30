import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";

export type CardVariant = "outline" | "elevated" | "filled";
export type CardPadding = "none" | "sm" | "md" | "lg";

export const cardVariants = cva(
  ["flex flex-col rounded-card font-ui text-foreground", "border-[length:var(--bokoui-border-width)]"],
  {
    variants: {
      variant: {
        outline: "border-border bg-surface",
        elevated: "border-border bg-surface shadow-button",
        filled: "border-transparent bg-muted",
      },
      padding: {
        none: "",
        sm: "gap-3 p-3",
        md: "gap-4 p-4 sm:p-5",
        lg: "gap-6 p-6 sm:p-8",
      },
      interactive: {
        true: [
          "cursor-pointer transition-[box-shadow,translate,border-color] duration-(--bokoui-duration) ease-ui focus-ring",
          "hover:[translate:var(--bokoui-shift-hover)] hover:shadow-button-hover active:[translate:var(--bokoui-shift-active)]",
        ],
        false: "",
      },
    },
    defaultVariants: { variant: "outline", padding: "md", interactive: false },
  },
);

export interface CardStyleProps {
  variant?: CardVariant;
  padding?: CardPadding;
  /** Hover/press feedback for clickable cards. Give the card a role or render it as a link/button. */
  interactive?: boolean;
}

export function cardClass({ variant, padding, interactive }: CardStyleProps, className?: ClassValue) {
  return cn(cardVariants({ variant, padding, interactive }), className);
}

export const cardHeaderClass = (className?: ClassValue) => cn("flex flex-col gap-1", className);
export const cardFooterClass = (className?: ClassValue) => cn("flex flex-wrap items-center gap-2", className);
