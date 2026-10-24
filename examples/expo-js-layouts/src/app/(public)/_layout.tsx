import { Slot, type ErrorBoundaryProps } from "expo-router";
import { View } from "react-native";
import { ErrorView } from "@/components/layout/error-view";
import { PublicFrame } from "@/components/layout/public-frame";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <PublicFrame>
      <ErrorView error={error} retry={retry} />
    </PublicFrame>
  );
}

/** Screens anyone can open: landing, public organization profiles, help, contact and the legal texts. */
export default function PublicLayout() {
  return (
    <PublicFrame>
      <View style={{ flexGrow: 1 }}>
        <Slot />
      </View>
    </PublicFrame>
  );
}
