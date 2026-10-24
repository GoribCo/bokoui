import { forwardRef, type TextareaHTMLAttributes } from "react";
import { resolveTone, textareaClass, type Action, type Color, type TextareaStyleProps } from "@/core";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    Pick<TextareaStyleProps, "variant" | "size" | "resize"> {
  /** Palette slot used for hover/focus emphasis. Default `primary`. */
  color?: Color;
  /** Semantic intent; overrides `color`. Ignored while `invalid` (danger wins). */
  action?: Action;
  /** Error state: danger border, `aria-invalid`. */
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, variant, size, resize, color = "primary", action, invalid = false, rows = 3, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      data-tone={invalid ? "danger" : resolveTone(color, action)}
      aria-invalid={invalid || undefined}
      className={textareaClass({ variant, size, resize }, className)}
      {...props}
    />
  );
});
