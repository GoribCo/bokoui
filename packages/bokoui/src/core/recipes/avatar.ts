import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import type { Size } from "../types";

export type AvatarShape = "circle" | "square";

/** Circular (or control-radius) frame. The fallback sits behind the image, so no state is needed. */
export const avatarVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden select-none",
    "bg-(--tone-soft) text-(--tone-ink) font-ui font-medium uppercase",
    "border-[length:var(--bokoui-border-width)] border-transparent",
  ],
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-12 text-base",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-control",
      },
    },
    defaultVariants: { size: "md", shape: "circle" },
  },
);

export interface AvatarStyleProps {
  size?: Size;
  shape?: AvatarShape;
}

export function avatarClass({ size, shape }: AvatarStyleProps, className?: ClassValue) {
  return cn(avatarVariants({ size, shape }), className);
}

export const avatarImageClass = "absolute inset-0 size-full object-cover";

/** Status dot: `data-tone` picks the color; the ring separates it from the photo. */
export const avatarStatusClass = cn(
  "absolute right-0 bottom-0 size-2.5 rounded-full bg-(--tone) ring-2 ring-background",
);

/** "Ada Lovelace" -> "AL". Empty input gives an empty string. */
export function getInitials(name: string | undefined, max = 2) {
  return (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .map((part) => Array.from(part)[0])
    .join("");
}
