import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";

// --- Label ---

export const labelVariants = cva(
  "inline-flex items-center gap-1 font-ui text-sm font-medium text-foreground peer-disabled:opacity-(--bokoui-disabled-opacity)",
  {
    variants: {
      disabled: { true: "opacity-(--bokoui-disabled-opacity)", false: "" },
    },
    defaultVariants: { disabled: false },
  },
);

export function labelClass(disabled?: boolean, className?: ClassValue) {
  return cn(labelVariants({ disabled }), className);
}

/** Class for the required marker (`*`). Render it `aria-hidden`; the control carries `required`. */
export const labelRequiredClass = "text-(--tone-ink)";

// --- FormField ---

export const formFieldClass = (className?: ClassValue) => cn("flex w-full flex-col gap-1.5", className);

export const fieldHintClass = (className?: ClassValue) => cn("font-ui text-sm text-muted-foreground", className);

/** Error text is painted from the danger tone; set `data-tone="danger"` on the element. */
export const fieldErrorClass = (className?: ClassValue) => cn("font-ui text-sm text-(--tone-ink)", className);

// --- ids and aria wiring (shared by every binding) ---

export interface FormFieldIds {
  control: string;
  hint: string;
  error: string;
}

/** Derives the ids a field's parts use from a single base id. */
export function formFieldIds(base: string): FormFieldIds {
  return { control: base, hint: `${base}-hint`, error: `${base}-error` };
}

/**
 * Value for the control's `aria-describedby`: the error when invalid, plus the hint when
 * present. Returns `undefined` when there is nothing to describe it with.
 */
export function describedBy(ids: FormFieldIds, state: { hint?: boolean; error?: boolean }) {
  const parts = [state.hint && ids.hint, state.error && ids.error].filter(Boolean);
  return parts.length ? parts.join(" ") : undefined;
}
