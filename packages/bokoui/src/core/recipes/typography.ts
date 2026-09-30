import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import type { Action, Color } from "../types";
import { resolveTone } from "../types";

// --- Heading ---

export const headingSizes = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const;
export type HeadingSize = (typeof headingSizes)[number];
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/** Size follows the element by default, so `as` alone gives a sensible outline. */
const defaultHeadingSize: Record<HeadingLevel, HeadingSize> = {
  h1: "4xl",
  h2: "3xl",
  h3: "2xl",
  h4: "xl",
  h5: "lg",
  h6: "md",
};

/** Family, weight, tracking and case come from the active style's heading tokens. */
export const headingVariants = cva(
  [
    "font-heading text-foreground text-balance leading-tight",
    "[font-weight:var(--bokoui-heading-weight)] [letter-spacing:var(--bokoui-heading-tracking)] [text-transform:var(--bokoui-heading-transform)]",
  ],
  {
    variants: {
      size: {
        sm: "text-base",
        md: "text-lg",
        lg: "text-xl",
        xl: "text-2xl",
        // Larger sizes scale up with the viewport (mobile-first).
        "2xl": "text-2xl md:text-3xl",
        "3xl": "text-3xl md:text-4xl",
        "4xl": "text-4xl md:text-5xl",
      },
    },
    defaultVariants: { size: "2xl" },
  },
);

export function headingClass(level: HeadingLevel, size?: HeadingSize, className?: ClassValue) {
  return cn(headingVariants({ size: size ?? defaultHeadingSize[level] }), className);
}

// --- Text ---

export type TextVariant = "body" | "lead" | "small" | "caption" | "code";

export const textVariants = cva("font-ui leading-(--bokoui-text-leading)", {
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
});

export function textClass(variant?: TextVariant, muted?: boolean, className?: ClassValue) {
  return cn(textVariants({ variant, muted }), className);
}

// --- Link ---

export type LinkUnderline = "always" | "hover" | "none";

export const linkVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-sm text-(--tone-ink) underline-offset-4",
    "transition-colors duration-(--bokoui-duration) ease-ui focus-ring",
    "[&_svg]:size-[0.85em] [&_svg]:shrink-0",
  ],
  {
    variants: {
      underline: {
        always: "underline",
        hover: "no-underline hover:underline",
        none: "no-underline",
      },
    },
    defaultVariants: { underline: "hover" },
  },
);

export function linkClass(underline?: LinkUnderline, className?: ClassValue) {
  return cn(linkVariants({ underline }), className);
}

export { resolveTone };
export type { Action, Color };
