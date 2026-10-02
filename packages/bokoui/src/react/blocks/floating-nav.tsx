import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { floatingNavClass, floatingNavItemClass, floatingNavListClass, floatingNavListItemClass } from "@/core";

export interface FloatingNavProps extends HTMLAttributes<HTMLElement> {
  /** Pin the bar above the bottom edge and the safe area. Default true; use `false` to place it yourself. */
  fixed?: boolean;
  /** Accessible name of the navigation landmark. Default "Main". */
  "aria-label"?: string;
}

/**
 * Floating pill navigation for phones: `<FloatingNav><FloatingNavItem href="/" active aria-label="Home"><HomeIcon /></FloatingNavItem></FloatingNav>`.
 * Server-safe (no state). Hide it from wide screens with a class, e.g. `className="md:hidden"`.
 */
export const FloatingNav = forwardRef<HTMLElement, FloatingNavProps>(function FloatingNav(
  { fixed = true, className, children, "aria-label": label = "Main", ...props },
  ref,
) {
  return (
    <nav ref={ref} aria-label={label} className={floatingNavClass(fixed, className)} {...props}>
      <ul className={floatingNavListClass}>{children}</ul>
    </nav>
  );
});

export type FloatingNavItemProps<T extends ElementType = "a"> = {
  /** Marks the current page (`aria-current="page"`) and fills the button. */
  active?: boolean;
  /** Link component, e.g. `next/link`, or `button`. Default `a`. */
  as?: T;
  className?: string;
  /** The icon. The button has no text, so give it an `aria-label`. */
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function FloatingNavItem<T extends ElementType = "a">({ active, as, className, children, ...props }: FloatingNavItemProps<T>) {
  const Tag: ElementType = as ?? "a";
  return (
    <li className={floatingNavListItemClass}>
      <Tag aria-current={active ? "page" : undefined} className={floatingNavItemClass(className)} {...props}>
        {children}
      </Tag>
    </li>
  );
}
