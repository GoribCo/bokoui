import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import { inputSizeClasses, isResponsive, responsiveClasses, type Responsive } from "../responsive";
import type { Size } from "../types";

export type InputVariant = "outline" | "filled" | "flushed";

export const inputVariants = cva(
  [
    "flex w-full min-w-0 items-center text-foreground placeholder:text-muted-foreground",
    "rounded-control border-[length:var(--bokoui-border-width)] font-ui",
    "transition-[background-color,border-color,box-shadow] duration-(--bokoui-duration) ease-ui",
    "focus-ring",
    // Touch devices get a 44px minimum target regardless of size.
    "pointer-coarse:min-h-11",
    "disabled:cursor-not-allowed disabled:opacity-(--bokoui-disabled-opacity)",
    "read-only:bg-muted",
    "file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium",
    // Chrome top-aligns file inputs; line-height = inner height centers them.
    "[&[type=file]]:leading-[calc(var(--h)-2*var(--bokoui-border-width))]",
  ],
  {
    variants: {
      variant: {
        outline: [
          "border-field-border bg-field",
          "enabled:hover:border-(--tone-ink) focus-visible:border-(--tone-ink)",
          "aria-invalid:border-(--tone)",
        ],
        filled: [
          "border-transparent bg-muted",
          "enabled:hover:bg-[color-mix(in_srgb,var(--bokoui-muted),var(--bokoui-fg)_6%)] focus-visible:border-(--tone-ink) focus-visible:bg-field",
          "aria-invalid:border-(--tone)",
        ],
        flushed: [
          "rounded-none border-0 border-b-[length:var(--bokoui-border-width)] border-field-border bg-transparent px-0!",
          "focus-visible:border-(--tone-ink)",
          "aria-invalid:border-(--tone)",
        ],
      },
      size: {
        sm: "h-8 [--h:2rem] px-2.5 text-sm",
        md: "h-10 [--h:2.5rem] px-3 text-sm",
        lg: "h-12 [--h:3rem] px-4 text-base",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);

export interface InputStyleProps {
  variant?: InputVariant;
  size?: Responsive<Size>;
  startAdornment?: boolean;
  endAdornment?: boolean;
}

export function inputClass({ variant, size, startAdornment, endAdornment }: InputStyleProps, className?: ClassValue) {
  const sizeMap = isResponsive(size) ? size : undefined;
  const flushed = variant === "flushed";
  return cn(
    inputVariants({ variant, size: sizeMap ? null : (size as Size | undefined) }),
    sizeMap && responsiveClasses(sizeMap, inputSizeClasses),
    startAdornment && (flushed ? "ps-7!" : "ps-9"),
    endAdornment && (flushed ? "pe-7!" : "pe-9"),
    className,
  );
}

/** Position classes for the decoration wrapper spans. */
export const inputAdornmentClass = (side: "start" | "end", variant?: InputVariant) =>
  cn(
    "pointer-events-none absolute inset-y-0 flex items-center text-muted-foreground [&>svg]:size-4",
    side === "start" ? (variant === "flushed" ? "start-0" : "start-3") : variant === "flushed" ? "end-0" : "end-3",
  );
