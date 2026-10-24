import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";

export type SkeletonShape = "text" | "rect" | "circle";

/** Placeholder block. Size it with classes (`h-24 w-full`, `size-12`); `circle` is round. */
export const skeletonVariants = cva("block animate-pulse bg-muted motion-reduce:animate-none", {
  variants: {
    shape: {
      text: "h-4 w-full rounded-control",
      rect: "rounded-card",
      circle: "size-10 rounded-full",
    },
  },
  defaultVariants: { shape: "text" },
});

export const skeletonClass = (shape: SkeletonShape | undefined, className?: ClassValue) => cn(skeletonVariants({ shape }), className);
