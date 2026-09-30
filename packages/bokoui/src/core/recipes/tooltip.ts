import { cn, type ClassValue } from "../cn";

/**
 * Tooltip surface. `popover="manual"` elements get UA styles (border, padding, inset, margin),
 * so those are reset here; position comes from inline style set by the binding.
 */
export const tooltipClass = (className?: ClassValue) =>
  cn(
    "pointer-events-none fixed m-0 max-w-xs overflow-visible border-0 px-2.5 py-1.5",
    "rounded-control bg-foreground font-ui text-xs text-background shadow-button-hover",
    "transition-opacity duration-(--bokoui-duration) ease-ui motion-reduce:transition-none",
    className,
  );
