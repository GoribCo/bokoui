import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { textClass, type TextVariant } from "@/core";

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
  return <Tag ref={ref} className={textClass(variant, muted, className)} {...props} />;
});
