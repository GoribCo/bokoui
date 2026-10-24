import { forwardRef, type InputHTMLAttributes } from "react";
import { resolveTone, sliderClass, type Action, type Color, type SliderStyleProps } from "@/core";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">, SliderStyleProps {
  color?: Color;
  action?: Action;
  /** Error state: danger tone, `aria-invalid`. */
  invalid?: boolean;
}

/**
 * A native range input, so keyboard (arrows, Home/End, PageUp/Down), touch, forms and screen
 * readers work without extra code. Label it with `FormField` or `aria-label`; show the live
 * value with your own state (`onChange`) or an `<output>`.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { className, size, color = "primary", action, invalid = false, min = 0, max = 100, step = 1, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      data-tone={invalid ? "danger" : resolveTone(color, action)}
      aria-invalid={invalid || undefined}
      className={sliderClass({ size }, className)}
      {...props}
    />
  );
});
