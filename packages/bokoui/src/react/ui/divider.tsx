import type { Ref } from "react";
import { forwardRef, type HTMLAttributes } from "react";
import { dividerClass, dividerLabelledClass, dividerLineClass, type DividerOrientation } from "@/core";

export interface DividerProps extends HTMLAttributes<HTMLElement> {
  orientation?: DividerOrientation;
  /** Centered text on a horizontal divider. */
  label?: string;
}

export const Divider = forwardRef<HTMLElement, DividerProps>(function Divider(
  { className, orientation = "horizontal", label, ...props },
  ref,
) {
  if (label && orientation === "horizontal") {
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        role="separator"
        aria-orientation="horizontal"
        className={dividerLabelledClass(className)}
        {...props}
      >
        <span aria-hidden="true" className={dividerLineClass} />
        <span>{label}</span>
        <span aria-hidden="true" className={dividerLineClass} />
      </div>
    );
  }
  return orientation === "vertical" ? (
    <div
      ref={ref as Ref<HTMLDivElement>}
      role="separator"
      aria-orientation="vertical"
      className={dividerClass(orientation, className)}
      {...props}
    />
  ) : (
    <hr ref={ref as Ref<HTMLHRElement>} className={dividerClass(orientation, className)} {...props} />
  );
});
