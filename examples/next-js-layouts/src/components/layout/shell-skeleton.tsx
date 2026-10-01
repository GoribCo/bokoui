import { Skeleton } from "bokoui/react";
import { AppFrame } from "./app-frame";

/**
 * What the shell looks like before its data arrives: a sidebar column, a header bar and a content block,
 * in the same places as the real shell so nothing jumps when it appears.
 */
export function ShellSkeleton({ label }: { label: string }) {
  return (
    <AppFrame fixedHeight>
      <div aria-busy="true" aria-label={label} role="status" className="flex h-full min-h-0">
        <aside className="hidden w-64 shrink-0 flex-col gap-3 border-e border-border p-3 md:flex">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 7 }, (_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
            <Skeleton className="size-8" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="ms-auto h-8 w-40" />
          </div>
          <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
