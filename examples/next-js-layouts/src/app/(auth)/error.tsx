"use client";

import { ErrorView, type ErrorViewProps } from "@/components/layout/error-view";

/** Error boundary inside the sign-in layout. */
export default function AuthError(props: ErrorViewProps) {
  return <ErrorView {...props} />;
}
