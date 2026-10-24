"use client";

import { ErrorView, type ErrorViewProps } from "@/components/layout/error-view";

/** Error boundary inside the public layout: only the content is replaced, the header and footer stay. */
export default function PublicError(props: ErrorViewProps) {
  return <ErrorView {...props} />;
}
