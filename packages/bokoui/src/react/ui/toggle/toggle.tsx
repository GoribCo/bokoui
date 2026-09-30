import { forwardRef, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import {
  checkboxCheckClass,
  checkboxClass,
  checkboxMinusClass,
  icons,
  radioClass,
  radioDotClass,
  radioGroupClass,
  resolveTone,
  switchClass,
  toggleLabelTextClass,
  toggleWrapperClass,
  type Action,
  type Color,
  type ToggleStyleProps,
} from "@/core";
import { Icon } from "../icon";

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">, ToggleStyleProps {
  /** Text next to the control. Wraps everything in a `<label>` so the text is clickable. */
  label?: ReactNode;
  color?: Color;
  action?: Action;
  /** Error state: danger tone, `aria-invalid`. */
  invalid?: boolean;
  /** Class for the outer wrapper (layout). The control itself is styled by the recipe. */
  className?: string;
}

/** Shared markup: wrapper (label or span) around the native input and an optional indicator. */
function useToggle({ label, color = "primary", action, invalid = false, className }: ToggleProps) {
  return {
    tone: invalid ? "danger" : resolveTone(color, action),
    Wrapper: label ? ("label" as const) : ("span" as const),
    wrapperClass: toggleWrapperClass(Boolean(label), className),
    text: label ? <span className={toggleLabelTextClass}>{label}</span> : null,
    invalidAttr: invalid || undefined,
  };
}

function omit({ label, color, action, invalid, className, size, ...rest }: ToggleProps) {
  void label, color, action, invalid, className, size;
  return rest;
}

export const Checkbox = forwardRef<HTMLInputElement, ToggleProps>(function Checkbox(props, ref) {
  const t = useToggle(props);
  return (
    <t.Wrapper data-tone={t.tone} className={t.wrapperClass}>
      <span className="relative inline-flex">
        <input
          ref={ref}
          type="checkbox"
          aria-invalid={t.invalidAttr}
          className={checkboxClass({ size: props.size })}
          {...omit(props)}
        />
        <Icon node={icons.check} strokeWidth={3} className={checkboxCheckClass} />
        <Icon node={icons.minus} strokeWidth={3} className={checkboxMinusClass} />
      </span>
      {t.text}
    </t.Wrapper>
  );
});

export const Radio = forwardRef<HTMLInputElement, ToggleProps>(function Radio(props, ref) {
  const t = useToggle(props);
  return (
    <t.Wrapper data-tone={t.tone} className={t.wrapperClass}>
      <span className="relative inline-flex">
        <input
          ref={ref}
          type="radio"
          aria-invalid={t.invalidAttr}
          className={radioClass({ size: props.size })}
          {...omit(props)}
        />
        <span aria-hidden="true" className={radioDotClass} />
      </span>
      {t.text}
    </t.Wrapper>
  );
});

export const Switch = forwardRef<HTMLInputElement, ToggleProps>(function Switch(props, ref) {
  const t = useToggle(props);
  return (
    <t.Wrapper data-tone={t.tone} className={t.wrapperClass}>
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        aria-invalid={t.invalidAttr}
        className={switchClass({ size: props.size })}
        {...omit(props)}
      />
      {t.text}
    </t.Wrapper>
  );
});

export interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
}

/** Layout and `role="radiogroup"` for a set of `Radio`s that share a `name`. Label it with `aria-label` or `aria-labelledby`. */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { orientation = "vertical", className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-orientation={orientation}
      className={radioGroupClass(orientation, className)}
      {...props}
    />
  );
});
