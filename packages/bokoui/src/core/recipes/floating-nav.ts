import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";

/**
 * Floating pill navigation (a mobile bottom bar): icon buttons in a rounded, softly shadowed pill, the current
 * one filled. `fixed` pins it above the bottom edge and the device safe area; without it the bar flows in the
 * layout, so content is never covered.
 */
export const floatingNavVariants = cva(
  "z-30 flex w-full items-center justify-around gap-1 rounded-full border-[length:var(--bokoui-border-width)] border-border bg-surface/90 p-1 font-ui text-muted-foreground shadow-lg backdrop-blur",
  {
    variants: {
      fixed: { true: "fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] mx-auto w-auto max-w-md", false: "" },
    },
    defaultVariants: { fixed: true },
  },
);

export type FloatingNavStyleProps = { fixed?: boolean };

export const floatingNavClass = (fixed: boolean | undefined, className?: ClassValue) => cn(floatingNavVariants({ fixed }), className);

export const floatingNavListClass = "flex w-full items-center justify-around gap-1";
export const floatingNavListItemClass = "flex min-w-0 flex-1 justify-center";

/** One round icon button or link; the current page (`aria-current="page"`) is filled with the foreground color. */
export const floatingNavItemClass = (className?: ClassValue) =>
  cn(
    "inline-flex size-12 items-center justify-center rounded-full text-muted-foreground no-underline",
    "transition-colors duration-(--bokoui-duration) ease-ui hover:bg-muted hover:text-foreground focus-ring",
    "aria-[current=page]:bg-foreground aria-[current=page]:text-background",
    "pointer-coarse:size-12 [&_svg]:size-5 [&_svg]:shrink-0",
    className,
  );
