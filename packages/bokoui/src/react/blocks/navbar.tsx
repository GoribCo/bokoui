"use client";

import { forwardRef, useEffect, useId, useState, type ComponentPropsWithoutRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import {
  cn,
  icons,
  navbarActionsClass,
  navbarBrandClass,
  navbarClass,
  navbarInnerClass,
  navbarLinkClass,
  navbarLinksClass,
  navbarToggleClass,
  resolveTone,
  type Action,
  type Color,
} from "@/core";
import { Icon } from "../internal/icon";

export interface NavbarProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Logo or name, usually a `NavbarBrand`. */
  brand?: ReactNode;
  /** `NavbarLink`s. On small screens they collapse behind a menu button. */
  children?: ReactNode;
  /** Right-aligned content (buttons, a theme switcher). Always visible. */
  actions?: ReactNode;
  sticky?: boolean;
  color?: Color;
  action?: Action;
  /** Accessible name of the navigation landmark. Default "Main". */
  "aria-label"?: string;
  menuLabel?: string;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar(
  { brand, children, actions, sticky, color = "primary", action, className, "aria-label": label = "Main", menuLabel = "Menu", ...props },
  ref,
) {
  const linksId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header ref={ref} data-tone={resolveTone(color, action)} className={navbarClass(sticky, className)} {...props}>
      <nav aria-label={label} className={navbarInnerClass}>
        {brand}
        <ul
          id={linksId}
          className={navbarLinksClass(open)}
          // A link press on a small screen should close the menu.
          onClick={(event) => (event.target as HTMLElement).closest("a") && setOpen(false)}
        >
          {children}
        </ul>
        {actions && <div className={navbarActionsClass()}>{actions}</div>}
        <button
          type="button"
          aria-label={menuLabel}
          aria-expanded={open}
          aria-controls={linksId}
          // With actions, they take the free space (ms-auto); otherwise the button does.
          className={cn(navbarToggleClass, !actions && "ms-auto")}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon node={open ? icons.close : icons.menu} />
        </button>
      </nav>
    </header>
  );
});

export type NavbarBrandProps<T extends ElementType = "a"> = { as?: T; className?: string; children?: ReactNode } & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "className" | "children"
>;

export function NavbarBrand<T extends ElementType = "a">({ as, className, ...props }: NavbarBrandProps<T>) {
  const Tag: ElementType = as ?? "a";
  return <Tag className={navbarBrandClass(className)} {...props} />;
}

export type NavbarLinkProps<T extends ElementType = "a"> = {
  /** Marks the current page (`aria-current="page"`). */
  active?: boolean;
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function NavbarLink<T extends ElementType = "a">({ active, as, className, ...props }: NavbarLinkProps<T>) {
  const Tag: ElementType = as ?? "a";
  return (
    <li>
      <Tag aria-current={active ? "page" : undefined} className={navbarLinkClass(className)} {...props} />
    </li>
  );
}
