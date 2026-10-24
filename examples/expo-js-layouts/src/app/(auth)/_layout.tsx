import { Slot, type ErrorBoundaryProps } from "expo-router";
import { ErrorView } from "@/components/layout/error-view";
import { PublicFrame } from "@/components/layout/public-frame";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <PublicFrame signInButton={false} centered>
      <ErrorView error={error} retry={retry} />
    </PublicFrame>
  );
}

/** Centered, shell-free layout for sign-in. */
export default function AuthLayout() {
  return (
    <PublicFrame signInButton={false} centered>
      <Slot />
    </PublicFrame>
  );
}
