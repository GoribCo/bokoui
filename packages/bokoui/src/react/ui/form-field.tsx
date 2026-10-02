import { cloneElement, forwardRef, useId, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { describedBy, fieldErrorClass, fieldHintClass, formFieldClass, formFieldIds } from "@/core";
import { Label } from "./label";

/** Props FormField passes to its control. Any component accepting them works. */
export interface FormFieldControlProps {
  id?: string;
  "aria-describedby"?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label?: ReactNode;
  /** Helper text under the control. */
  hint?: ReactNode;
  /** Error message. Presence marks the control invalid. */
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Base id for the control and its label/hint/error. Generated when omitted. */
  id?: string;
  /** A single control (Input, Textarea, ...). It receives id, aria-describedby, invalid, required and disabled. */
  children: ReactElement<FormFieldControlProps>;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  { label, hint, error, required, disabled, id, className, children, ...props },
  ref,
) {
  const generated = useId();
  const ids = formFieldIds(id ?? children.props.id ?? generated);
  const invalid = Boolean(error);

  return (
    <div ref={ref} className={formFieldClass(className)} {...props}>
      {label && (
        <Label htmlFor={ids.control} required={required} disabled={disabled}>
          {label}
        </Label>
      )}
      {cloneElement(children, {
        id: ids.control,
        "aria-describedby": describedBy(ids, { hint: Boolean(hint), error: invalid }),
        invalid: invalid || children.props.invalid,
        required: required ?? children.props.required,
        disabled: disabled ?? children.props.disabled,
      })}
      {hint && (
        <p id={ids.hint} className={fieldHintClass()}>
          {hint}
        </p>
      )}
      {invalid && (
        <p id={ids.error} role="alert" data-tone="danger" className={fieldErrorClass()}>
          {error}
        </p>
      )}
    </div>
  );
});
