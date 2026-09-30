import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";
import { resolveTone, type Action, type Color } from "../types";

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

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Palette slot. Default `primary`. */
  color?: Color;
  /** Semantic intent; overrides `color`. */
  action?: Action;
  underline?: LinkUnderline;
  /** Opens in a new tab with `rel="noopener noreferrer"` and shows an icon. */
  external?: boolean;
}

/** Plain `<a>`. To use a router link, apply `linkVariants()` to its className. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, color = "primary", action, underline, external, children, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      data-tone={resolveTone(color, action)}
      className={cn(linkVariants({ underline }), className)}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      {...props}
    >
      {children}
      {external && (
        <>
          <ExternalLink aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </a>
  );
});
