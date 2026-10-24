import { forwardRef, useId, type HTMLAttributes, type ReactNode } from "react";
import {
  progressBarClass,
  progressHeaderClass,
  progressTrackClass,
  progressValueClass,
  resolveTone,
  type Action,
  type Color,
  type ProgressStyleProps,
} from "@/core";

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, "children">, ProgressStyleProps {
  /** Current value. Omit for an indeterminate (unknown-length) bar. */
  value?: number;
  max?: number;
  color?: Color;
  action?: Action;
  /** Text above the bar; also the accessible name. Without it, pass `aria-label`. */
  label?: ReactNode;
  /** Show the percentage next to the label. */
  showValue?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, size, color = "primary", action, label, showValue = false, className, ...props },
  ref,
) {
  const labelId = useId();
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0;

  return (
    <div data-tone={resolveTone(color, action)} className={className}>
      {(label || (showValue && !indeterminate)) && (
        <div className={progressHeaderClass}>
          {label && <span id={labelId}>{label}</span>}
          {showValue && !indeterminate && <span className={progressValueClass}>{percent}%</span>}
        </div>
      )}
      <div
        ref={ref}
        role="progressbar"
        aria-labelledby={label ? labelId : undefined}
        aria-valuemin={0}
        aria-valuemax={max}
        // No aria-valuenow tells assistive tech the progress is indeterminate.
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuetext={indeterminate ? undefined : `${percent}%`}
        className={progressTrackClass({ size })}
        {...props}
      >
        <div className={progressBarClass(indeterminate)} style={indeterminate ? undefined : { width: `${percent}%` }} />
      </div>
    </div>
  );
});
