import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import {
  resolveTone,
  sidebarClass,
  sidebarItemClass,
  sidebarItemDescriptionClass,
  sidebarItemEndClass,
  sidebarItemLabelClass,
  sidebarSectionClass,
  sidebarSectionTitleClass,
  type Action,
  type Color,
} from "@/core";

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Icon-only rail. Controlled: the toggle button is yours. */
  collapsed?: boolean;
  color?: Color;
  action?: Action;
  /** Accessible name of the navigation landmark. Default "Sidebar". */
  "aria-label"?: string;
}

/**
 * Vertical navigation. Compose with `SidebarSection` and `SidebarItem`. Server-safe: it holds no
 * state and uses no context; `collapsed` comes from you. In the collapsed rail only icons show,
 * so wrap items in a `Tooltip` (from `bokoui/react/client`) to keep the names discoverable.
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { collapsed = false, color = "primary", action, className, "aria-label": label = "Sidebar", ...props },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={label}
      data-tone={resolveTone(color, action)}
      data-collapsed={collapsed || undefined}
      className={sidebarClass(className)}
      {...props}
    />
  );
});

export interface SidebarSectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const SidebarSection = forwardRef<HTMLDivElement, SidebarSectionProps>(function SidebarSection(
  { title, className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} role="group" aria-label={title} className={sidebarSectionClass(className)} {...props}>
      {title && <div className={sidebarSectionTitleClass}>{title}</div>}
      {children}
    </div>
  );
});

export type SidebarItemProps<T extends ElementType = "a"> = {
  /** Marks the current page (`aria-current="page"`). */
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  /** Secondary line under the label (hidden when collapsed). */
  description?: string;
  /** Trailing content, e.g. a `Badge`. */
  end?: ReactNode;
  /** Link component, e.g. `next/link` or `NuxtLink`. Default `a`. */
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function SidebarItem<T extends ElementType = "a">({
  active,
  disabled,
  icon,
  description,
  end,
  as,
  className,
  children,
  ...props
}: SidebarItemProps<T>) {
  const Link: ElementType = as ?? "a";
  return (
    <Link
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={sidebarItemClass(className)}
      {...props}
    >
      {icon}
      <span className={sidebarItemLabelClass}>
        {children}
        {description && <span className={sidebarItemDescriptionClass}>{description}</span>}
      </span>
      {end && <span className={sidebarItemEndClass}>{end}</span>}
    </Link>
  );
}
