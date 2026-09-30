import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from 'bokoui/expo';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { customThemes } from '@/styles/custom-themes';

function ThemedStack() {
  const { tokens, resolvedMode } = useTheme();
  return (
    <>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: tokens.bg } }} />
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
