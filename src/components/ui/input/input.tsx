import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { resolveTone, type Action, type Color, type Size } from "../types";

export type InputVariant = "outline" | "filled" | "flushed";

export const inputVariants = cva(
  [
    "flex w-full min-w-0 items-center text-foreground placeholder:text-muted-foreground",
    "rounded-control border-[length:var(--ui-border-width)] font-ui",
    "transition-[background-color,border-color,box-shadow] duration-(--ui-duration) ease-ui",
    "focus-ring",
    "disabled:cursor-not-allowed disabled:opacity-(--ui-disabled-opacity)",
    "read-only:bg-muted",
    "file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium",
    // Chrome top-aligns file inputs; line-height = inner height centers them.
    "[&[type=file]]:leading-[calc(var(--h)-2*var(--ui-border-width))]",
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
          "enabled:hover:bg-[color-mix(in_srgb,var(--ui-muted),var(--ui-fg)_6%)] focus-visible:border-(--tone-ink) focus-visible:bg-field",
          "aria-invalid:border-(--tone)",
        ],
        flushed: [
          "rounded-none border-0 border-b-[length:var(--ui-border-width)] border-field-border bg-transparent px-0!",
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

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant;
  size?: Size;
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

const adornmentBase =
  "pointer-events-none absolute inset-y-0 flex items-center text-muted-foreground [&>svg]:size-4";

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
  const hasAdornment = Boolean(startAdornment || endAdornment);
  const flushed = variant === "flushed";

  const input = (
    <input
      ref={ref}
      type={type}
      data-tone={invalid ? "danger" : resolveTone(color, action)}
      aria-invalid={invalid || undefined}
      className={cn(
        inputVariants({ variant, size }),
        startAdornment && (flushed ? "ps-7!" : "ps-9"),
        endAdornment && (flushed ? "pe-7!" : "pe-9"),
        className,
      )}
      {...props}
    />
  );

  if (!hasAdornment) return input;

  return (
    <div className={cn("relative w-full", containerClassName)}>
      {input}
      {startAdornment && (
        <span className={cn(adornmentBase, flushed ? "start-0" : "start-3")}>{startAdornment}</span>
      )}
      {endAdornment && (
        <span className={cn(adornmentBase, flushed ? "end-0" : "end-3")}>{endAdornment}</span>
      )}
    </div>
  );
});
