import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import type { Size } from "../types";

export const progressTrackVariants = cva("relative w-full overflow-hidden rounded-full bg-muted", {
  variants: { size: { sm: "h-1.5", md: "h-2.5", lg: "h-4" } },
  defaultVariants: { size: "md" },
});

export interface ProgressStyleProps {
  size?: Size;
}

export const progressTrackClass = ({ size }: ProgressStyleProps, className?: ClassValue) =>
  cn(progressTrackVariants({ size }), className);

/** Width is set inline from the value. Indeterminate slides a third of the track; reduced motion pulses instead. */
export const progressBarClass = (indeterminate: boolean) =>
  cn(
    "h-full rounded-full bg-(--tone)",
    indeterminate
      ? "w-1/3 animate-bokoui-indeterminate motion-reduce:w-full motion-reduce:animate-pulse"
      : "transition-[width] duration-(--bokoui-duration) ease-ui motion-reduce:transition-none",
  );

export const progressHeaderClass = "mb-1.5 flex items-baseline justify-between gap-4 font-ui text-sm text-foreground";
export const progressValueClass = "tabular-nums text-muted-foreground";
