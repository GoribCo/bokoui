import { forwardRef, type LabelHTMLAttributes } from "react";
import { labelClass, labelRequiredClass } from "@/core";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Shows a `*` marker. The control itself must also be `required`. */
  required?: boolean;
  /** Dims the label to match a disabled control. */
  disabled?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, required, disabled, children, ...props },
  ref,
) {
  return (
    <label ref={ref} className={labelClass(disabled, className)} {...props}>
      {children}
      {required && (
        <span aria-hidden="true" data-tone="danger" className={labelRequiredClass}>
          *
        </span>
      )}
    </label>
  );
});
