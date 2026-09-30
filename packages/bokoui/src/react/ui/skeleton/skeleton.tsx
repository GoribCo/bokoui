import { forwardRef, type HTMLAttributes } from "react";
import { cn, skeletonClass, type SkeletonShape } from "@/core";

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  shape?: SkeletonShape;
}

/**
 * A pulsing placeholder. It is decorative (`aria-hidden`): mark the surrounding region
 * `aria-busy="true"` while loading so assistive tech knows content is coming.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton({ shape, className, ...props }, ref) {
  return <span ref={ref} aria-hidden="true" className={skeletonClass(shape, className)} {...props} />;
});

export interface SkeletonTextProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

/** Paragraph placeholder: full-width lines with a shorter last one. */
export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(function SkeletonText(
  { lines = 3, className, ...props },
  ref,
) {
  return (
    <div ref={ref} aria-hidden="true" className={cn("flex flex-col gap-2", className)} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={i === lines - 1 && lines > 1 ? "w-3/5" : undefined} />
      ))}
    </div>
  );
});
