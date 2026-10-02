import { Backdrop } from "bokoui/expo/ui";
import { useTheme } from "bokoui/expo";
import { DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider, type ErrorBoundaryProps } from "expo-router";
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

const transparentNavigationTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: "transparent" } };

function ThemedStack() {
  const { tokens, resolvedMode } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg }}>
      {/* The style's page (gradient, glows) sits behind every screen; screens stay transparent. */}
      <Backdrop />
      <StatusBar style={resolvedMode === "dark" ? "light" : "dark"} />
      {/* The navigation container paints its own background; make it see-through so the Backdrop shows. */}
      <NavigationThemeProvider value={transparentNavigationTheme}>
        <Stack screenOptions={{ headerShown: false, animation: "none", contentStyle: { backgroundColor: "transparent" } }} />
      </NavigationThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <ThemedStack />
    </AppProviders>
  );
}
