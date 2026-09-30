import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cva } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  fullWidthClasses,
  isResponsive,
  buttonIconSizeClasses,
  buttonSizeClasses,
  responsiveClasses,
  type Breakpoint,
  type Responsive,
} from "../responsive";
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
    "focus-ring [&_svg]:size-4 [&_svg]:shrink-0",
    "disabled:cursor-not-allowed disabled:opacity-(--bokoui-disabled-opacity)",
    "enabled:hover:[translate:var(--bokoui-shift-hover)] enabled:active:[translate:var(--bokoui-shift-active)]",
    // Touch devices get a 44px minimum target regardless of size.
    "pointer-coarse:min-h-11",
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
          "h-auto! min-h-0! rounded-none border-transparent bg-transparent px-0! text-(--tone-ink) underline-offset-4",
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
      { size: "sm", iconOnly: true, className: "w-8 pointer-coarse:min-w-11" },
      { size: "md", iconOnly: true, className: "w-10 pointer-coarse:min-w-11" },
      { size: "lg", iconOnly: true, className: "w-12 pointer-coarse:min-w-11" },
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
  /** A size, or a per-breakpoint map: `{ base: "sm", md: "lg" }` (mobile-first). */
  size?: Responsive<Size>;
  /** Square button for a single icon. Provide `aria-label`. */
  iconOnly?: boolean;
  /** Boolean, or per-breakpoint map: `{ base: true, md: false }`. */
  fullWidth?: Responsive<boolean>;
  /** Shows a spinner, sets `aria-busy` and disables interaction. */
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

function toKeys(map: Partial<Record<Breakpoint, boolean>>) {
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, String(v)])) as Partial<
    Record<Breakpoint, "true" | "false">
  >;
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
  const sizeMap = isResponsive(size) ? size : undefined;
  const widthMap = isResponsive(fullWidth) ? fullWidth : undefined;

  return (
    <button
      ref={ref}
      type={type}
      data-tone={resolveTone(color, action)}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(
        buttonVariants({
          variant,
          // null switches off the cva default so responsive classes fully own the size.
          size: sizeMap ? null : (size as Size | undefined),
          iconOnly,
          fullWidth: widthMap ? null : (fullWidth as boolean | undefined),
        }),
        sizeMap && responsiveClasses(sizeMap, iconOnly ? buttonIconSizeClasses : buttonSizeClasses),
        widthMap && responsiveClasses(toKeys(widthMap), fullWidthClasses),
        className,
      )}
      {...props}
    >
      {loading ? (
        <LoaderCircle className="size-4 animate-spin motion-reduce:animate-pulse" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
