import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { breadcrumbCurrentClass, breadcrumbItemClass, breadcrumbLinkClass, breadcrumbListClass } from "@/core";

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name of the landmark. Default "Breadcrumb". */
  "aria-label"?: string;
}

/** `<Breadcrumb><BreadcrumbItem href="/">Home</BreadcrumbItem><BreadcrumbItem current>Page</BreadcrumbItem></Breadcrumb>` */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { className, children, "aria-label": label = "Breadcrumb", ...props },
  ref,
) {
  return (
    <nav ref={ref} aria-label={label} {...props}>
      <ol className={breadcrumbListClass(className)}>{children}</ol>
    </nav>
  );
});

export type BreadcrumbItemProps<T extends ElementType = "a"> = {
  /** Marks the page you are on: rendered as text with `aria-current="page"`. */
  current?: boolean;
  /** Link component, e.g. `next/link` or `NuxtLink`. Default `a`. */
  as?: T;
  children?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function BreadcrumbItem<T extends ElementType = "a">({
  current,
  as,
  className,
  children,
  ...props
}: BreadcrumbItemProps<T>) {
  const Link: ElementType = as ?? "a";
  return (
    <li className={breadcrumbItemClass()}>
      {current || !(as || "href" in props) ? (
        <span aria-current={current ? "page" : undefined} className={current ? breadcrumbCurrentClass(className) : className}>
          {children}
        </span>
      ) : (
        <Link className={breadcrumbLinkClass(className)} {...props}>
          {children}
        </Link>
      )}
    </li>
  );
}
