import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";

export type ToastPlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";

/** Fixed stack. `popover="manual"` (set by the binding) lifts it above open dialogs. */
export const toastViewportVariants = cva(
  "pointer-events-none fixed m-0 flex max-h-dvh w-[min(24rem,calc(100vw-2rem))] flex-col gap-2 overflow-visible border-0 bg-transparent p-0 font-ui",
  {
    variants: {
      placement: {
        "top-right": "top-4 right-4 bottom-auto left-auto",
        "top-left": "top-4 left-4 right-auto bottom-auto",
        "top-center": "top-4 left-1/2 right-auto bottom-auto -translate-x-1/2",
        "bottom-right": "bottom-4 right-4 top-auto left-auto flex-col-reverse",
        "bottom-left": "bottom-4 left-4 top-auto right-auto flex-col-reverse",
        "bottom-center": "bottom-4 left-1/2 top-auto right-auto -translate-x-1/2 flex-col-reverse",
      },
    },
    defaultVariants: { placement: "bottom-right" },
  },
);

export const toastViewportClass = (placement: ToastPlacement | undefined, className?: ClassValue) =>
  cn(toastViewportVariants({ placement }), className);

/** Each toast re-enables pointer events so it can be hovered, focused and dismissed. The solid surface sits under the (translucent) alert tint. */
export const toastItemClass = "pointer-events-auto list-none rounded-card bg-surface shadow-button-hover animate-bokoui-toast-in motion-reduce:animate-none";
