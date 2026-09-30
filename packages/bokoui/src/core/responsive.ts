import type { Size } from "./types";

/**
 * LOOKUP TABLES (generated once, edit with care). Tailwind only emits classes it finds as complete
 * literal strings, so every breakpoint-prefixed class is spelled out here instead
 * of being built at runtime.
 */

export type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

type SizeTable = Record<Breakpoint, Record<Size, string>>;
type FlagTable = Record<Breakpoint, Record<"true" | "false", string>>;

const order: Breakpoint[] = ["base", "sm", "md", "lg", "xl", "2xl"];

/** Joins the classes for each breakpoint present in a responsive value. */
export function responsiveClasses<T extends string>(
  value: Partial<Record<Breakpoint, T>>,
  table: Record<Breakpoint, Record<T, string>>,
): string {
  return order
    .flatMap((bp) => {
      const v = value[bp];
      return v === undefined ? [] : [table[bp][v]];
    })
    .join(" ");
}

export function isResponsive<T>(value: Responsive<T> | undefined): value is Partial<Record<Breakpoint, T>> {
  return typeof value === "object" && value !== null;
}

export const buttonSizeClasses: SizeTable = {
  base: {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  },
  sm: {
    sm: "sm:h-8 sm:px-3 sm:text-sm",
    md: "sm:h-10 sm:px-4 sm:text-sm",
    lg: "sm:h-12 sm:px-6 sm:text-base",
  },
  md: {
    sm: "md:h-8 md:px-3 md:text-sm",
    md: "md:h-10 md:px-4 md:text-sm",
    lg: "md:h-12 md:px-6 md:text-base",
  },
  lg: {
    sm: "lg:h-8 lg:px-3 lg:text-sm",
    md: "lg:h-10 lg:px-4 lg:text-sm",
    lg: "lg:h-12 lg:px-6 lg:text-base",
  },
  xl: {
    sm: "xl:h-8 xl:px-3 xl:text-sm",
    md: "xl:h-10 xl:px-4 xl:text-sm",
    lg: "xl:h-12 xl:px-6 xl:text-base",
  },
  "2xl": {
    sm: "2xl:h-8 2xl:px-3 2xl:text-sm",
    md: "2xl:h-10 2xl:px-4 2xl:text-sm",
    lg: "2xl:h-12 2xl:px-6 2xl:text-base",
  },
};

export const buttonIconSizeClasses: SizeTable = {
  base: {
    sm: "h-8 w-8 px-0 text-sm",
    md: "h-10 w-10 px-0 text-sm",
    lg: "h-12 w-12 px-0 text-base",
  },
  sm: {
    sm: "sm:h-8 sm:w-8 sm:px-0 sm:text-sm",
    md: "sm:h-10 sm:w-10 sm:px-0 sm:text-sm",
    lg: "sm:h-12 sm:w-12 sm:px-0 sm:text-base",
  },
  md: {
    sm: "md:h-8 md:w-8 md:px-0 md:text-sm",
    md: "md:h-10 md:w-10 md:px-0 md:text-sm",
    lg: "md:h-12 md:w-12 md:px-0 md:text-base",
  },
  lg: {
    sm: "lg:h-8 lg:w-8 lg:px-0 lg:text-sm",
    md: "lg:h-10 lg:w-10 lg:px-0 lg:text-sm",
    lg: "lg:h-12 lg:w-12 lg:px-0 lg:text-base",
  },
  xl: {
    sm: "xl:h-8 xl:w-8 xl:px-0 xl:text-sm",
    md: "xl:h-10 xl:w-10 xl:px-0 xl:text-sm",
    lg: "xl:h-12 xl:w-12 xl:px-0 xl:text-base",
  },
  "2xl": {
    sm: "2xl:h-8 2xl:w-8 2xl:px-0 2xl:text-sm",
    md: "2xl:h-10 2xl:w-10 2xl:px-0 2xl:text-sm",
    lg: "2xl:h-12 2xl:w-12 2xl:px-0 2xl:text-base",
  },
};

export const inputSizeClasses: SizeTable = {
  base: {
    sm: "h-8 [--h:2rem] px-2.5 text-sm",
    md: "h-10 [--h:2.5rem] px-3 text-sm",
    lg: "h-12 [--h:3rem] px-4 text-base",
  },
  sm: {
    sm: "sm:h-8 sm:[--h:2rem] sm:px-2.5 sm:text-sm",
    md: "sm:h-10 sm:[--h:2.5rem] sm:px-3 sm:text-sm",
    lg: "sm:h-12 sm:[--h:3rem] sm:px-4 sm:text-base",
  },
  md: {
    sm: "md:h-8 md:[--h:2rem] md:px-2.5 md:text-sm",
    md: "md:h-10 md:[--h:2.5rem] md:px-3 md:text-sm",
    lg: "md:h-12 md:[--h:3rem] md:px-4 md:text-base",
  },
  lg: {
    sm: "lg:h-8 lg:[--h:2rem] lg:px-2.5 lg:text-sm",
    md: "lg:h-10 lg:[--h:2.5rem] lg:px-3 lg:text-sm",
    lg: "lg:h-12 lg:[--h:3rem] lg:px-4 lg:text-base",
  },
  xl: {
    sm: "xl:h-8 xl:[--h:2rem] xl:px-2.5 xl:text-sm",
    md: "xl:h-10 xl:[--h:2.5rem] xl:px-3 xl:text-sm",
    lg: "xl:h-12 xl:[--h:3rem] xl:px-4 xl:text-base",
  },
  "2xl": {
    sm: "2xl:h-8 2xl:[--h:2rem] 2xl:px-2.5 2xl:text-sm",
    md: "2xl:h-10 2xl:[--h:2.5rem] 2xl:px-3 2xl:text-sm",
    lg: "2xl:h-12 2xl:[--h:3rem] 2xl:px-4 2xl:text-base",
  },
};

export const fullWidthClasses: FlagTable = {
  base: { true: "w-full", false: "w-auto" },
  sm: { true: "sm:w-full", false: "sm:w-auto" },
  md: { true: "md:w-full", false: "md:w-auto" },
  lg: { true: "lg:w-full", false: "lg:w-auto" },
  xl: { true: "xl:w-full", false: "xl:w-auto" },
  "2xl": { true: "2xl:w-full", false: "2xl:w-auto" },
};

