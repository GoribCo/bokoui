import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import type { Size } from "../types";

/**
 * A native `<input type="range">`: keyboard, touch, form submission and screen readers come
 * for free. `accent-color` paints the filled part and thumb in the tone, in every engine.
 */
export const sliderVariants = cva(
  [
    "block w-full cursor-pointer rounded-full accent-(--tone) focus-ring",
    "disabled:cursor-not-allowed disabled:opacity-(--bokoui-disabled-opacity)",
    "aria-invalid:accent-(--tone)",
    "pointer-coarse:min-h-11",
  ],
  {
    variants: { size: { sm: "h-4", md: "h-5", lg: "h-6" } },
    defaultVariants: { size: "md" },
  },
);

export interface SliderStyleProps {
  size?: Size;
}

export const sliderClass = ({ size }: SliderStyleProps, className?: ClassValue) => cn(sliderVariants({ size }), className);
export const sliderHeaderClass = "mb-1 flex items-baseline justify-between gap-4 font-ui text-sm text-foreground";
export const sliderValueClass = "tabular-nums text-muted-foreground";
