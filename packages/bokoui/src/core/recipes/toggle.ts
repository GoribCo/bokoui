import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import type { Size } from "../types";

/*
 * Checkbox, Radio and Switch are native inputs (appearance-none) so keyboard, form
 * submission and assistive tech come for free. `data-tone` sits on the wrapper; the input
 * and its indicator icon read the tone variables from there. Checked state is pure CSS.
 */

const control = [
  "peer shrink-0 appearance-none m-0 cursor-pointer",
  "border-[length:var(--bokoui-border-width)] border-field-border bg-field",
  "transition-[background-color,border-color,box-shadow] duration-(--bokoui-duration) ease-ui focus-ring",
  "enabled:hover:border-(--tone-ink) aria-invalid:border-(--tone)",
  "disabled:cursor-not-allowed disabled:opacity-(--bokoui-disabled-opacity)",
];

const checkedFill = "checked:border-(--tone-border) checked:bg-(--tone)";

export const checkboxVariants = cva([...control, checkedFill, "indeterminate:border-(--tone-border) indeterminate:bg-(--tone)", "rounded-[calc(var(--bokoui-radius-control)/2)]"], {
  variants: { size: { sm: "size-4", md: "size-5", lg: "size-6" } },
  defaultVariants: { size: "md" },
});

export const radioVariants = cva([...control, checkedFill, "rounded-full"], {
  variants: { size: { sm: "size-4", md: "size-5", lg: "size-6" } },
  defaultVariants: { size: "md" },
});

export const switchVariants = cva(
  [
    ...control,
    "relative rounded-full bg-muted",
    "checked:border-(--tone-border) checked:bg-(--tone)",
    // Thumb: a pseudo-element that slides from the start edge to the end edge.
    "before:absolute before:top-1/2 before:-translate-y-1/2 before:rounded-full before:content-['']",
    "before:size-(--thumb) before:start-[2px] before:bg-muted-foreground",
    "before:transition-[inset-inline-start,background-color] before:duration-(--bokoui-duration) before:ease-ui",
    "checked:before:start-[calc(100%-2px-var(--thumb))] checked:before:bg-(--tone-fg)",
    "motion-reduce:before:transition-none",
  ],
  {
    variants: {
      size: {
        sm: "h-5 w-9 [--thumb:0.875rem]",
        md: "h-6 w-11 [--thumb:1.125rem]",
        lg: "h-7 w-[3.25rem] [--thumb:1.375rem]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface ToggleStyleProps {
  size?: Size;
}

export const checkboxClass = ({ size }: ToggleStyleProps, className?: ClassValue) => cn(checkboxVariants({ size }), className);
export const radioClass = ({ size }: ToggleStyleProps, className?: ClassValue) => cn(radioVariants({ size }), className);
export const switchClass = ({ size }: ToggleStyleProps, className?: ClassValue) => cn(switchVariants({ size }), className);

/** Wrapper: a `<label>` when the control has visible text, otherwise a plain inline box. */
export const toggleWrapperClass = (hasLabel: boolean, className?: ClassValue) =>
  cn(
    "relative inline-flex items-center font-ui text-sm text-foreground",
    hasLabel && "gap-2 pointer-coarse:min-h-11",
    className,
  );

/** Text next to the control; dims when the input is disabled. */
export const toggleLabelTextClass = "select-none peer-disabled:opacity-(--bokoui-disabled-opacity)";

/** Indicator icons painted over a checkbox; the sibling input's state shows one of them. */
const indicator = "pointer-events-none absolute start-0 top-0 size-full p-[15%] text-(--tone-fg) opacity-0";
export const checkboxCheckClass = cn(indicator, "peer-[:checked:not(:indeterminate)]:opacity-100");
export const checkboxMinusClass = cn(indicator, "peer-indeterminate:opacity-100");
export const radioDotClass = cn(
  "pointer-events-none absolute start-1/2 top-1/2 size-2/5 -translate-x-1/2 -translate-y-1/2 rounded-full",
  "bg-(--tone-fg) opacity-0 peer-checked:opacity-100",
);

export const radioGroupClass = (orientation: "vertical" | "horizontal" = "vertical", className?: ClassValue) =>
  cn("flex", orientation === "vertical" ? "flex-col gap-2" : "flex-row flex-wrap gap-4", className);
