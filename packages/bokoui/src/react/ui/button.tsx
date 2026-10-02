import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { buttonClass, icons, resolveTone, type Action, type ButtonStyleProps, type Color } from "@/core";
import { Icon } from "../internal/icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {
  /** Brand palette slot. Default `primary`. */
  color?: Color;
  /** Semantic intent; overrides `color` when set. */
  action?: Action;
  /** Shows a spinner, sets `aria-busy` and disables interaction. */
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Square button for a single icon. Provide `aria-label`. */
  iconOnly?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    color = "primary",
    action,
    size,
    iconOnly,
    fullWidth,
    loading = false,
    leftIcon,
    rightIcon,
    type = "button",
    disabled,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-tone={resolveTone(color, action)}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={buttonClass({ variant, size, iconOnly, fullWidth }, className)}
      {...props}
    >
      {loading ? <Icon node={icons.loader} className="animate-spin motion-reduce:animate-pulse" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
