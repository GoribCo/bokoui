import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { resolveTone, type Action, type Color, type Size, type Variant } from "../types";

/**
 * All variant styling lives here. Colors come from `data-tone` (see styles/tokens.css),
 * so variant x size is the only matrix; tone never multiplies it.
 */
export const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap select-none",
    "rounded-button border-[length:var(--bokoui-border-width)]",
    "font-ui [font-weight:var(--bokoui-btn-weight)] [text-transform:var(--bokoui-btn-transform)] [letter-spacing:var(--bokoui-btn-tracking)]",
    "transition-[background-color,border-color,color,box-shadow,translate] duration-(--bokoui-duration) ease-ui",
    "focus-ring",
    "disabled:cursor-not-allowed disabled:opacity-(--bokoui-disabled-opacity)",
    "enabled:hover:[translate:var(--bokoui-shift-hover)] enabled:active:[translate:var(--bokoui-shift-active)]",
  ],
  {
    variants: {
      variant: {
        solid: [
          "border-(--tone-border) bg-(--tone) text-(--tone-fg) shadow-button",
          "enabled:hover:bg-[color-mix(in_srgb,var(--tone),var(--bokoui-hover-mix))] enabled:hover:shadow-button-hover",
          "enabled:active:bg-[color-mix(in_srgb,var(--tone),var(--bokoui-active-mix))]",
        ],
        outline: [
          "border-(--tone-ink) bg-transparent text-(--tone-ink) shadow-button",
          "enabled:hover:bg-(--tone-soft) enabled:hover:shadow-button-hover",
          "enabled:active:bg-(--tone-soft-hover)",
        ],
        soft: [
          "border-transparent bg-(--tone-soft) text-(--tone-ink)",
          "enabled:hover:bg-(--tone-soft-hover)",
          "enabled:active:bg-(--tone-soft-hover)",
        ],
        ghost: [
          "border-transparent bg-transparent text-(--tone-ink)",
          "enabled:hover:bg-(--tone-soft)",
          "enabled:active:bg-(--tone-soft-hover)",
        ],
        link: [
          "h-auto! rounded-none border-transparent bg-transparent px-0! text-(--tone-ink) underline-offset-4",
          "enabled:hover:underline",
        ],
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
      iconOnly: {
        true: "px-0",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      { size: "sm", iconOnly: true, className: "w-8" },
      { size: "md", iconOnly: true, className: "w-10" },
      { size: "lg", iconOnly: true, className: "w-12" },
    ],
    defaultVariants: {
      variant: "solid",
      size: "md",
      iconOnly: false,
      fullWidth: false,
    },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual treatment. Default `solid`. */
  variant?: Variant;
  /** Brand palette slot. Default `primary`. */
  color?: Color;
  /** Semantic intent; overrides `color` when set. */
  action?: Action;
  size?: Size;
  /** Square button for a single icon. Provide `aria-label`. */
  iconOnly?: boolean;
  fullWidth?: boolean;
  /** Shows a spinner, sets `aria-busy` and disables interaction. */
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin motion-reduce:animate-pulse"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
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
      className={cn(buttonVariants({ variant, size, iconOnly, fullWidth }), className)}
      {...props}
    >
      {loading ? <Spinner /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
