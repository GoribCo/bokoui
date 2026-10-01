import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, ToastProvider, useTheme } from 'bokoui/expo';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { customThemes } from '@/styles/custom-themes';

function ThemedStack() {
  const { tokens, resolvedMode } = useTheme();
  return (
    <>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ToastProvider placement="bottom-center" offset={32}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: tokens.bg } }} />
      </ToastProvider>
    </>
  );
}

export default function RootLayout() {
  return (
    // storage is optional: it persists the chosen style and mode across launches.
    <ThemeProvider customThemes={customThemes} storage={AsyncStorage}>
      <ThemedStack />
    </ThemeProvider>
  );
}
