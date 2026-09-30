import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about the framework's custom @theme keys so that
// e.g. `rounded-full` correctly overrides `rounded-button`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["control", "button"],
      shadow: ["button", "button-hover"],
    },
  },
});

export type { ClassValue };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
