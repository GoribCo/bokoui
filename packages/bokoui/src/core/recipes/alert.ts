import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import { icons, type IconNode } from "../icons";
import type { Tone } from "../types";
import { toneSolidClass } from "./shared";

export type AlertVariant = "soft" | "solid" | "outline";

export const alertVariants = cva(
  [
    "relative flex w-full items-start gap-3 rounded-card p-4 font-ui text-sm",
    "border-[length:var(--bokoui-border-width)]",
    "[&_svg]:size-5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        soft: "border-transparent bg-(--tone-soft) text-foreground [&>svg:first-child]:text-(--tone-ink)",
        solid: toneSolidClass,
        outline: "border-(--tone-ink) bg-transparent text-foreground [&>svg:first-child]:text-(--tone-ink)",
      },
    },
    defaultVariants: { variant: "soft" },
  },
);

export interface AlertStyleProps {
  variant?: AlertVariant;
}

export function alertClass({ variant }: AlertStyleProps, className?: ClassValue) {
  return cn(alertVariants({ variant }), className);
}

export const alertTitleClass = "font-semibold leading-snug";
export const alertBodyClass = "flex min-w-0 flex-1 flex-col gap-1";
export const alertCloseClass = cn(
  "-m-1 ms-auto inline-flex size-8 shrink-0 items-center justify-center rounded-control",
  "opacity-80 transition-opacity hover:opacity-100 focus-ring pointer-coarse:size-11",
);

/** Default icon for a tone; brand colors fall back to the info icon. */
export function alertIcon(tone: Tone): IconNode {
  switch (tone) {
    case "success":
      return icons.success;
    case "warning":
      return icons.warning;
    case "danger":
      return icons.danger;
    default:
      return icons.info;
  }
}

/** Urgent tones interrupt assistive tech; the rest are polite status updates. */
export function alertRole(tone: Tone): "alert" | "status" {
  return tone === "danger" || tone === "warning" ? "alert" : "status";
}
