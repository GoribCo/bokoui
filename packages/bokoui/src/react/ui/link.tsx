import { forwardRef, type AnchorHTMLAttributes } from "react";
import { icons, linkClass, resolveTone, type Action, type Color, type LinkUnderline } from "@/core";
import { Icon } from "../internal/icon";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Palette slot. Default `primary`. */
  color?: Color;
  /** Semantic intent; overrides `color`. */
  action?: Action;
  underline?: LinkUnderline;
  /** Opens in a new tab with `rel="noopener noreferrer"` and shows an icon. */
  external?: boolean;
}

/** Plain `<a>`. To use a router link, apply `linkClass()` from `bokoui/core` to its className. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, color = "primary", action, underline, external, children, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      data-tone={resolveTone(color, action)}
      className={linkClass(underline, className)}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      {...props}
    >
      {children}
      {external && (
        <>
          <Icon node={icons.externalLink} />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </a>
  );
});
