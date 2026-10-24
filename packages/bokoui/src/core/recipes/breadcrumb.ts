import { cn, type ClassValue } from "../cn";

export const breadcrumbListClass = (className?: ClassValue) =>
  cn("flex flex-wrap items-center gap-x-1.5 gap-y-1 font-ui text-sm text-muted-foreground", className);

/** The separator is drawn in CSS, so no extra element is needed in the markup. */
export const breadcrumbItemClass = (className?: ClassValue) =>
  cn(
    "inline-flex items-center gap-1.5",
    "not-first:before:me-1.5 not-first:before:text-muted-foreground/60 not-first:before:content-['/']",
    className,
  );

export const breadcrumbLinkClass = (className?: ClassValue) =>
  cn(
    "rounded-sm transition-colors duration-(--bokoui-duration) ease-ui hover:text-foreground hover:underline",
    "underline-offset-4 focus-ring",
    className,
  );

export const breadcrumbCurrentClass = (className?: ClassValue) => cn("font-medium text-foreground", className);
