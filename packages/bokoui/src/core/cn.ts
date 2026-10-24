import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about the framework's custom @theme keys so that
// e.g. `rounded-full` correctly overrides `rounded-button`. Keep in sync with `@theme` in styles/bokoui.css.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["control", "button", "card"],
      shadow: ["button", "button-hover"],
      font: ["ui", "heading"],
      ease: ["ui"],
    },
  },
});

export type { ClassValue };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
