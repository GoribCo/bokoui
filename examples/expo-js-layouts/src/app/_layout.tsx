import { useTheme } from "bokoui/expo";
import { Stack, type ErrorBoundaryProps } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { reportError } from "@/lib/monitoring/report-error";
import { AppProviders } from "@/providers/app-providers";

/**
 * Last resort: it renders outside the providers (the failure may be in them), so it uses plain React Native
 * and no theme. Every route group has a themed boundary of its own.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  reportError(error, { source: "error-boundary", scope: "root" });
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
      <Text accessibilityRole="header" style={{ fontSize: 20, fontWeight: "600" }}>
        Something went wrong
      </Text>
      <Text accessibilityRole="button" onPress={retry} style={{ fontSize: 16, textDecorationLine: "underline" }}>
        Try again
      </Text>
    </View>
  );
}

function ThemedStack() {
  const { tokens, resolvedMode } = useTheme();
  return (
    <>
      <StatusBar style={resolvedMode === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, animation: "none", contentStyle: { backgroundColor: tokens.bg } }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <ThemedStack />
    </AppProviders>
  );
}
