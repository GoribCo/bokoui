import { cn, type ClassValue } from "../cn";

/*
 * Collapsed state is `data-collapsed` on the <nav>; items and titles react through the
 * `group/sidebar` variant, so no React context is needed and the parts stay server-safe.
 * Every class below is a complete literal: Tailwind cannot see names built at runtime.
 */

/** Vertical navigation column. Collapsed = icon rail; labels stay in the DOM for screen readers. */
export const sidebarClass = (className?: ClassValue) =>
  cn(
    "group/sidebar flex w-60 shrink-0 flex-col gap-1 overflow-y-auto p-3 font-ui",
    "border-e-[length:var(--bokoui-border-width)] border-border bg-surface",
    "transition-[width] duration-(--bokoui-duration) ease-ui motion-reduce:transition-none",
    "data-[collapsed]:w-16 data-[collapsed]:items-center data-[collapsed]:px-2",
    className,
  );

export const sidebarSectionClass = (className?: ClassValue) => cn("flex flex-col gap-1 not-first:mt-3", className);

export const sidebarSectionTitleClass = cn(
  "px-3 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase",
  "group-data-[collapsed]/sidebar:sr-only",
);

/** Active page comes from `aria-current="page"`. */
export const sidebarItemClass = (className?: ClassValue) =>
  cn(
    "relative flex w-full items-center gap-3 rounded-control px-3 py-2 text-sm text-muted-foreground no-underline",
    "transition-colors duration-(--bokoui-duration) ease-ui focus-ring pointer-coarse:min-h-11",
    "hover:bg-muted hover:text-foreground",
    "aria-[current=page]:bg-(--tone-soft) aria-[current=page]:font-medium aria-[current=page]:text-(--tone-ink)",
    "aria-disabled:pointer-events-none aria-disabled:opacity-(--bokoui-disabled-opacity)",
    "[&_svg]:size-5 [&_svg]:shrink-0",
    "group-data-[collapsed]/sidebar:size-10 group-data-[collapsed]/sidebar:justify-center group-data-[collapsed]/sidebar:px-0",
    className,
  );

/** Text next to the icon; hidden visually (kept for screen readers) when collapsed. */
export const sidebarItemLabelClass = cn("min-w-0 flex-1 truncate text-start", "group-data-[collapsed]/sidebar:sr-only");
export const sidebarItemDescriptionClass = "block truncate text-xs font-normal text-muted-foreground";
export const sidebarItemEndClass = cn("ms-auto shrink-0", "group-data-[collapsed]/sidebar:sr-only");
