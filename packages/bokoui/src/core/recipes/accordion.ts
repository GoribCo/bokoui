import { cn, type ClassValue } from "../cn";
import { disabledClass } from "./shared";

export const accordionClass = (className?: ClassValue) =>
  cn("w-full font-ui text-foreground", className);

export const accordionItemClass = (className?: ClassValue) =>
  cn("border-b-[length:var(--bokoui-border-width)] border-border", className);

/** The chevron rotates from `aria-expanded`, so no state class is needed. */
export const accordionTriggerClass = (className?: ClassValue) =>
  cn(
    "flex w-full items-center justify-between gap-4 rounded-control py-4 text-start text-sm font-medium",
    "transition-colors duration-(--bokoui-duration) ease-ui hover:text-(--tone-ink) focus-ring pointer-coarse:min-h-11",
    disabledClass,
    "[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground [&>svg]:transition-transform [&>svg]:duration-(--bokoui-duration) motion-reduce:[&>svg]:transition-none",
    "aria-expanded:[&>svg]:rotate-180",
    className,
  );

/** Animates height with grid rows (0fr to 1fr), which needs no measuring. Closed content is `inert`. */
export const accordionContentClass = (open: boolean) =>
  cn(
    "grid text-sm text-muted-foreground transition-[grid-template-rows] duration-(--bokoui-duration) ease-ui motion-reduce:transition-none",
    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
  );
export const accordionContentInnerClass = "min-h-0 overflow-hidden";
export const accordionContentBodyClass = "pb-4";
