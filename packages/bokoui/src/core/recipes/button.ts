import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import {
  buttonIconSizeClasses,
  buttonSizeClasses,
  fullWidthClasses,
  isResponsive,
  responsiveClasses,
  type Breakpoint,
  type Responsive,
} from "../responsive";
import type { Size, Variant } from "../types";
import { disabledClass } from "./shared";

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
    disabledClass,
    "enabled:hover:[translate:var(--bokoui-shift-hover)] enabled:active:[translate:var(--bokoui-shift-active)]",
    // Touch devices get a 44px minimum target regardless of size.
    "pointer-coarse:min-h-11",
  ],
  {
    variants: {
      variant: {
        solid: [
          "border-[color:var(--bokoui-solid-border,var(--tone-border))] bg-(--tone) text-(--tone-fg) [background-image:var(--bokoui-solid-image,none)] [box-shadow:var(--bokoui-solid-shadow,var(--bokoui-shadow-button))]",
          "enabled:hover:bg-[color-mix(in_srgb,var(--tone),var(--bokoui-hover-mix))] enabled:hover:shadow-button-hover",
          "enabled:active:bg-[color-mix(in_srgb,var(--tone),var(--bokoui-active-mix))] enabled:active:[box-shadow:var(--bokoui-pressed-shadow,var(--bokoui-shadow-button-hover))]",
        ],
        outline: [
          "border-[color:var(--bokoui-control-border,var(--tone-ink))] bg-[var(--bokoui-control-bg,transparent)] text-(--tone-ink) [background-image:var(--bokoui-control-image,none)] [box-shadow:var(--bokoui-control-shadow,var(--bokoui-shadow-button))] [-webkit-backdrop-filter:var(--bokoui-control-backdrop,none)] [backdrop-filter:var(--bokoui-control-backdrop,none)]",
          "enabled:hover:bg-[var(--bokoui-control-bg-hover,var(--tone-soft))] enabled:hover:shadow-button-hover",
          "enabled:active:bg-[var(--bokoui-pressed-bg,var(--tone-soft-hover))] enabled:active:[box-shadow:var(--bokoui-pressed-shadow,var(--bokoui-shadow-button-hover))]",
        ],
        soft: [
          "border-[color:var(--bokoui-control-border,transparent)] bg-[var(--bokoui-control-bg,var(--tone-soft))] text-(--tone-ink) [background-image:var(--bokoui-control-image,none)] [box-shadow:var(--bokoui-control-shadow,none)] [-webkit-backdrop-filter:var(--bokoui-control-backdrop,none)] [backdrop-filter:var(--bokoui-control-backdrop,none)]",
          "enabled:hover:bg-[var(--bokoui-control-bg-hover,var(--tone-soft-hover))]",
          "enabled:active:bg-[var(--bokoui-pressed-bg,var(--tone-soft-hover))] enabled:active:[box-shadow:var(--bokoui-pressed-shadow,none)]",
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

export interface ButtonStyleProps {
  variant?: Variant;
  /** A size, or a per-breakpoint map: `{ base: "sm", md: "lg" }` (mobile-first). */
  size?: Responsive<Size>;
  iconOnly?: boolean;
  /** Boolean, or per-breakpoint map: `{ base: true, md: false }`. */
  fullWidth?: Responsive<boolean>;
}

function flagKeys(map: Partial<Record<Breakpoint, boolean>>) {
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, String(v)])) as Partial<
    Record<Breakpoint, "true" | "false">
  >;
}

/** Final class string for a button: variants + responsive maps + the caller's classes. */
export function buttonClass({ variant, size, iconOnly, fullWidth }: ButtonStyleProps, className?: ClassValue) {
  const sizeMap = isResponsive(size) ? size : undefined;
  const widthMap = isResponsive(fullWidth) ? fullWidth : undefined;
  return cn(
    buttonVariants({
      variant,
      // null switches off the cva default so responsive classes fully own the size.
      size: sizeMap ? null : (size as Size | undefined),
      iconOnly,
      fullWidth: widthMap ? null : (fullWidth as boolean | undefined),
    }),
    sizeMap && responsiveClasses(sizeMap, iconOnly ? buttonIconSizeClasses : buttonSizeClasses),
    widthMap && responsiveClasses(flagKeys(widthMap), fullWidthClasses),
    className,
  );
}
