"use client";

import { ErrorView, type ErrorViewProps } from "@/components/layout/error-view";

/** Error boundary inside the shell: only the content area is replaced. */
export default function DashboardError(props: ErrorViewProps) {
  return <ErrorView {...props} />;
}
