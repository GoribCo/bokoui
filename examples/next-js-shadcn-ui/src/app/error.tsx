"use client";

import { ErrorView, type ErrorViewProps } from "@/components/layout/error-view";

export default function GlobalSegmentError(props: ErrorViewProps) {
  return (
    <main id="main-content" className="flex min-h-dvh items-center justify-center bg-background text-foreground">
      <ErrorView {...props} />
    </main>
  );
}
