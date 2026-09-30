import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import type { Size } from "../types";
import { inputVariants, type InputVariant } from "./input";

export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

/** Height comes from `rows`, so size only sets padding and type size. */
export const textareaVariants = cva("h-auto! min-h-20 items-start py-2 leading-normal", {
  variants: {
    size: {
      sm: "px-2.5 text-sm",
      md: "px-3 text-sm",
      lg: "px-4 py-2.5 text-base",
    },
    resize: {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    },
  },
  defaultVariants: { size: "md", resize: "vertical" },
});

export interface TextareaStyleProps {
  variant?: InputVariant;
  size?: Size;
  resize?: TextareaResize;
}

/** Shares the Input's variants, colors and states; only sizing and resize differ. */
export function textareaClass({ variant, size, resize }: TextareaStyleProps, className?: ClassValue) {
  return cn(
    // size null: the input's fixed-height sizes do not apply to a multi-line field.
    inputVariants({ variant, size: null }),
    textareaVariants({ size, resize }),
    variant === "flushed" && "px-0!",
    className,
  );
}
