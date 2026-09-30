import { forwardRef, type HTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const headingSizes = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const;
export type HeadingSize = (typeof headingSizes)[number];
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/** Size follows the element by default, so `as` alone gives a sensible outline. */
const defaultSize: Record<HeadingLevel, HeadingSize> = {
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

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Rendered element. Default `h2`. Keep the document outline in order. */
  as?: HeadingLevel;
  /** Visual size, independent of the element. Defaults from `as`. */
  size?: HeadingSize;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { as: Tag = "h2", size, className, ...props },
  ref,
) {
  return <Tag ref={ref} className={cn(headingVariants({ size: size ?? defaultSize[Tag] }), className)} {...props} />;
});
