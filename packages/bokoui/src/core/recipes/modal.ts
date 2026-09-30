import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";

export type ModalSize = "sm" | "md" | "lg" | "full";
export type ModalPlacement = "center" | "right" | "left" | "bottom";

/**
 * A native `<dialog>` opened with `showModal()`. The browser provides the top layer, focus
 * trap, Escape, and inert background; this recipe supplies the look and the `::backdrop`.
 */
export const modalVariants = cva(
  [
    "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] flex-col overflow-hidden p-0",
    "rounded-card border-[length:var(--bokoui-border-width)] border-border bg-surface font-ui text-foreground shadow-button-hover",
    "backdrop:bg-black/50 backdrop:backdrop-blur-[2px]",
    // `flex` only when open: a base `display` would override the UA `dialog:not([open]) { display: none }`.
    "open:flex",
  ],
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-3xl",
        full: "max-w-none h-[calc(100dvh-2rem)]",
      },
      // Side placements make a drawer. They come after `size`, so they win where they conflict.
      placement: {
        center: "",
        right: "m-0 ms-auto h-dvh max-h-dvh w-full rounded-none border-y-0 border-e-0",
        left: "m-0 me-auto h-dvh max-h-dvh w-full rounded-none border-y-0 border-s-0",
        bottom: "m-0 mt-auto max-h-[85dvh] w-full max-w-none rounded-b-none border-x-0 border-b-0",
      },
    },
    defaultVariants: { size: "md", placement: "center" },
  },
);

export interface ModalStyleProps {
  size?: ModalSize;
  /** `center` is a dialog; `left`, `right` and `bottom` anchor it to an edge as a drawer/sheet. */
  placement?: ModalPlacement;
}

export const modalClass = ({ size, placement }: ModalStyleProps, className?: ClassValue) =>
  cn(modalVariants({ size, placement }), className);

export const modalHeaderClass = "flex items-start justify-between gap-4 px-5 pt-5";
export const modalTitleClass =
  "font-heading text-lg leading-tight text-foreground [font-weight:var(--bokoui-heading-weight)] [letter-spacing:var(--bokoui-heading-tracking)] [text-transform:var(--bokoui-heading-transform)]";
export const modalDescriptionClass = "mt-1 text-sm text-muted-foreground";
export const modalBodyClass = "min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm";
export const modalFooterClass = "flex flex-wrap items-center justify-end gap-2 px-5 pb-5";
export const modalCloseClass = cn(
  "-me-2 -mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-control text-muted-foreground",
  "transition-colors hover:bg-muted hover:text-foreground focus-ring pointer-coarse:size-11 [&_svg]:size-5",
);
