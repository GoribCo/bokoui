import { forwardRef, type HTMLAttributes } from "react";
import { icons, resolveTone, spinnerClass, type Action, type Color, type SpinnerStyleProps } from "@/core";
import { Icon } from "../icon";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement>, SpinnerStyleProps {
  color?: Color;
  action?: Action;
  /** Accessible text announced to screen readers. Default "Loading". */
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { className, size, color = "primary", action, label = "Loading", ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      data-tone={resolveTone(color, action)}
      className="inline-flex"
      {...props}
    >
      <Icon node={icons.loader} className={spinnerClass({ size }, className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
});
