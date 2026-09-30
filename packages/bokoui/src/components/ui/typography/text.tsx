import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const textVariants = cva(
  "font-ui leading-(--bokoui-text-leading)",
  {
    variants: {
      variant: {
        body: "text-base",
        lead: "text-lg md:text-xl",
        small: "text-sm",
        caption: "text-xs",
        code: "font-mono text-[0.9em] rounded-control bg-muted px-1.5 py-0.5",
      },
      muted: {
        true: "text-muted-foreground",
        false: "text-foreground",
      },
    },
    defaultVariants: { variant: "body", muted: false },
  },
);

export type TextVariant = "body" | "lead" | "small" | "caption" | "code";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  /** Secondary color. */
  muted?: boolean;
  /** Rendered element. Default `p`; `code` variant defaults to `code`. */
  as?: "p" | "span" | "div" | "label" | "small" | "code";
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as, variant, muted, className, ...props },
  ref,
) {
  const Tag = (as ?? (variant === "code" ? "code" : "p")) as ElementType;
  return <Tag ref={ref} className={cn(textVariants({ variant, muted }), className)} {...props} />;
});
