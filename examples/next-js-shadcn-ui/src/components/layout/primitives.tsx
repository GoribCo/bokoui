import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * shadcn/ui ships no typography or layout components, so these are plain Tailwind wrappers:
 * a heading, body text, a responsive grid, a wrapping row and a centered container.
 */

const headingSizes = {
  md: "text-base font-semibold",
  lg: "text-lg font-semibold",
  xl: "text-xl font-semibold tracking-tight",
  "2xl": "text-2xl font-semibold tracking-tight",
  "3xl": "text-3xl font-semibold tracking-tight md:text-4xl",
} as const;

export function Heading({
  as: Tag = "h2",
  size = "xl",
  className,
  ...props
}: ComponentProps<"h2"> & { as?: "h1" | "h2" | "h3" | "h4"; size?: keyof typeof headingSizes }) {
  return <Tag className={cn(headingSizes[size], className)} {...props} />;
}

export function Text({
  as: Tag = "p",
  muted = false,
  className,
  ...props
}: ComponentProps<"p"> & { as?: ElementType; muted?: boolean }) {
  return <Tag className={cn("text-sm leading-6", muted && "text-muted-foreground", className)} {...props} />;
}

const gridCols = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  auto: "grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]",
} as const;

export function Grid({ cols = "auto", className, ...props }: ComponentProps<"div"> & { cols?: keyof typeof gridCols }) {
  return <div className={cn("grid gap-4", gridCols[cols], className)} {...props} />;
}

const gaps = { 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4" } as const;

export function Inline({ gap = 2, className, ...props }: ComponentProps<"div"> & { gap?: keyof typeof gaps }) {
  return <div className={cn("flex flex-wrap items-center", gaps[gap], className)} {...props} />;
}

const containerSizes = { sm: "max-w-2xl", md: "max-w-3xl", lg: "max-w-6xl", xl: "max-w-7xl", full: "max-w-none" } as const;

export function Container({
  size = "full",
  className,
  children,
}: {
  size?: keyof typeof containerSizes;
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("mx-auto w-full px-4 sm:px-6", containerSizes[size], className)}>{children}</div>;
}
