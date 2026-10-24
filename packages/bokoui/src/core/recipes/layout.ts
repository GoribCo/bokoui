import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";

/*
 * Layout primitives. They only arrange children (gap, wrap, columns, max width); they set no
 * colors, so they never fight a style. Gaps use Tailwind's spacing scale (1 = 0.25rem).
 */
const gaps = { 0: "gap-0", 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4", 5: "gap-5", 6: "gap-6", 8: "gap-8", 10: "gap-10", 12: "gap-12" } as const;
export type Gap = keyof typeof gaps;

export const stackVariants = cva("flex flex-col", {
  variants: {
    gap: gaps,
    align: { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch" },
  },
  defaultVariants: { gap: 4, align: "stretch" },
});
export interface StackStyleProps {
  gap?: Gap;
  align?: "start" | "center" | "end" | "stretch";
}
export const stackClass = ({ gap, align }: StackStyleProps, className?: ClassValue) => cn(stackVariants({ gap, align }), className);

export const inlineVariants = cva("flex flex-row flex-wrap", {
  variants: {
    gap: gaps,
    align: { start: "items-start", center: "items-center", end: "items-end", baseline: "items-baseline" },
    justify: { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between" },
  },
  defaultVariants: { gap: 3, align: "center", justify: "start" },
});
export interface InlineStyleProps {
  gap?: Gap;
  align?: "start" | "center" | "end" | "baseline";
  justify?: "start" | "center" | "end" | "between";
}
export const inlineClass = ({ gap, align, justify }: InlineStyleProps, className?: ClassValue) =>
  cn(inlineVariants({ gap, align, justify }), className);

export const containerVariants = cva("mx-auto w-full px-4 sm:px-6", {
  variants: { size: { sm: "max-w-2xl", md: "max-w-4xl", lg: "max-w-6xl", xl: "max-w-7xl", full: "max-w-none" } },
  defaultVariants: { size: "lg" },
});
export interface ContainerStyleProps {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}
export const containerClass = ({ size }: ContainerStyleProps, className?: ClassValue) => cn(containerVariants({ size }), className);

/** Fixed literal class names per column count: Tailwind cannot see names assembled at runtime. */
export const gridVariants = cva("grid", {
  variants: {
    gap: gaps,
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-2 lg:grid-cols-4",
      auto: "grid-cols-[repeat(auto-fill,minmax(min(16rem,100%),1fr))]",
    },
  },
  defaultVariants: { gap: 4, cols: 3 },
});
export interface GridStyleProps {
  gap?: Gap;
  /** Responsive presets: 2 = 1 then 2 columns, 3 = 1/2/3, 4 = 2/4, `auto` = as many 16rem+ columns as fit. */
  cols?: 1 | 2 | 3 | 4 | "auto";
}
export const gridClass = ({ gap, cols }: GridStyleProps, className?: ClassValue) => cn(gridVariants({ gap, cols }), className);
