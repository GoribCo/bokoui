import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";

/** Popover surface shared by Menu and Select. Position comes from inline style. */
export const popoverPanelClass = (className?: ClassValue) =>
  cn(
    "fixed m-0 min-w-40 max-h-72 overflow-auto p-1",
    "rounded-control border-[length:var(--bokoui-border-width)] border-border bg-surface font-ui text-sm text-foreground shadow-button-hover",
    "outline-none",
    className,
  );

/** Row inside a menu (highlighted by focus) or listbox (highlighted by `data-highlighted`). */
export const menuItemVariants = cva(
  [
    "relative flex w-full cursor-pointer items-center gap-2 rounded-[calc(var(--bokoui-radius-control)/1.5)] px-2.5 py-1.5 text-start select-none",
    "text-foreground outline-none pointer-coarse:min-h-11",
    "focus:bg-(--tone-soft) focus:text-(--tone-ink) data-[highlighted]:bg-(--tone-soft) data-[highlighted]:text-(--tone-ink)",
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-(--bokoui-disabled-opacity)",
    "aria-selected:font-medium [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: { tone: { default: "", danger: "text-(--tone-ink)" } },
    defaultVariants: { tone: "default" },
  },
);

export const menuItemClass = (danger?: boolean, className?: ClassValue) =>
  cn(menuItemVariants({ tone: danger ? "danger" : "default" }), className);

export const menuSeparatorClass = "-mx-1 my-1 h-px bg-border";
export const menuLabelClass = "px-2.5 py-1.5 text-xs font-medium text-muted-foreground";
