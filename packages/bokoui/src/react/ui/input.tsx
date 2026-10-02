import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import {
  cn,
  inputAdornmentClass,
  inputClass,
  resolveTone,
  type Action,
  type Color,
  type InputStyleProps,
} from "@/core";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    Pick<InputStyleProps, "variant" | "size"> {
  /** Palette slot used for hover/focus emphasis. Default `primary`. */
  color?: Color;
  /** Semantic intent; overrides `color`. Ignored while `invalid` (danger wins). */
  action?: Action;
  /** Error state: danger border, `aria-invalid`. */
  invalid?: boolean;
  /** Decoration inside the field, before the text (e.g. an icon). Not interactive. */
  startAdornment?: ReactNode;
  /** Decoration inside the field, after the text. Not interactive. */
  endAdornment?: ReactNode;
  /** Class for the wrapper rendered when an adornment is present. */
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    containerClassName,
    variant,
    size,
    color = "primary",
    action,
    invalid = false,
    startAdornment,
    endAdornment,
    type = "text",
    ...props
  },
  ref,
) {
  const input = (
    <input
      ref={ref}
      type={type}
      data-tone={invalid ? "danger" : resolveTone(color, action)}
      aria-invalid={invalid || undefined}
      className={inputClass(
        { variant, size, startAdornment: Boolean(startAdornment), endAdornment: Boolean(endAdornment) },
        className,
      )}
      {...props}
    />
  );

  if (!startAdornment && !endAdornment) return input;

  return (
    <div className={cn("relative w-full", containerClassName)}>
      {input}
      {startAdornment && <span className={inputAdornmentClass("start", variant)}>{startAdornment}</span>}
      {endAdornment && <span className={inputAdornmentClass("end", variant)}>{endAdornment}</span>}
    </div>
  );
});
