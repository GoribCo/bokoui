import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";

export const navbarVariants = cva("z-20 w-full border-b-[length:var(--bokoui-border-width)] border-border bg-surface font-ui text-foreground", {
  variants: {
    sticky: { true: "sticky top-0 bg-surface/90 backdrop-blur", false: "" },
  },
  defaultVariants: { sticky: false },
});

export const navbarClass = (sticky: boolean | undefined, className?: ClassValue) => cn(navbarVariants({ sticky }), className);

/** Bar contents; the links panel drops below the bar on small screens and inlines from `md`. */
export const navbarInnerClass = "mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 md:flex-nowrap";
export const navbarBrandClass = (className?: ClassValue) =>
  cn("inline-flex items-center gap-2 rounded-control font-heading text-base font-semibold text-foreground no-underline focus-ring", className);
export const navbarToggleClass =
  "inline-flex size-10 items-center justify-center rounded-control text-foreground hover:bg-muted focus-ring md:hidden [&_svg]:size-5 pointer-coarse:size-11";
export const navbarLinksClass = (open: boolean, className?: ClassValue) =>
  cn(
    "order-last w-full flex-col gap-1 md:order-none md:flex md:w-auto md:flex-1 md:flex-row md:items-center",
    open ? "flex" : "hidden",
    className,
  );
export const navbarLinkClass = (className?: ClassValue) =>
  cn(
    "inline-flex items-center gap-2 rounded-control px-3 py-2 text-sm text-muted-foreground no-underline",
    "transition-colors duration-(--bokoui-duration) ease-ui hover:bg-muted hover:text-foreground focus-ring pointer-coarse:min-h-11",
    "aria-[current=page]:bg-(--tone-soft) aria-[current=page]:font-medium aria-[current=page]:text-(--tone-ink)",
    "[&_svg]:size-4 [&_svg]:shrink-0",
    className,
  );
export const navbarActionsClass = (className?: ClassValue) => cn("ms-auto flex items-center gap-2", className);
