# bokoui Expo example

Demo app for [bokoui](../../packages/bokoui) using `bokoui/expo`, built with Expo (SDK 57) and Expo Router. It shows the same page as the [Next.js](../next-js) and [Nuxt](../nuxt-js) examples: style and mode switcher, every Button variant and Input state, typography and a custom theme. There is no Tailwind or CSS here; the components paint themselves from the same theme tokens.

## Run

```bash
npm install
npm run dev          # Metro on :8081 (or $PORT); press w for web, i for iOS, a for Android
npm run web          # web only
```

`bokoui` is installed from the registry in `.npmrc` (local Verdaccio, `http://127.0.0.1:4873/`). From the repo root, `./run.sh` publishes the library there and runs every example on its own port.

## Install bokoui in your own Expo app

Needs Expo SDK 54+ (React Native 0.76+). There is no CSS or Tailwind step.

```bash
npx expo install bokoui @react-native-async-storage/async-storage expo-blur
```

`async-storage` is optional (it keeps the chosen style and mode across launches); `expo-blur` is used by the glass styles.

Wrap the app once, in the root layout (`app/_layout.tsx` with Expo Router):

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, ToastProvider } from 'bokoui/expo';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider defaultStyle="material" storage={AsyncStorage}>
      <ToastProvider>
        <Stack />
      </ToastProvider>
    </ThemeProvider>
  );
}
```

Use components and the theme anywhere below it:

```tsx
import { Button, Heading, Input, Text, useTheme } from 'bokoui/expo';

export default function Home() {
  const { tokens, setStyle, setMode } = useTheme(); // tokens: resolved colors and numbers for your own views
  return (
    <>
      <Heading as="h1">Hello</Heading>
      <Text muted>Same style names and colors as the web.</Text>
      <Input placeholder="Email" />
      <Button color="primary" onPress={() => setStyle('material')}>Material</Button>
    </>
  );
}
```

Differences from the web: use `onPress` (not `onClick`), no responsive props, no hover or box shadows (a pressed state instead), and fonts are not applied (pass `style={{ fontFamily }}` or load fonts with `expo-font`). The in-app `/setup` page shows the same steps.

For a complete application shell on Expo (drawer, bottom navigation, organizations, roles, i18n) see [expo-js-layouts](../expo-js-layouts).

## Structure

- `src/app/_layout.tsx`: `ThemeProvider` from `bokoui/expo` (with `AsyncStorage` to persist the choice and the custom theme) around an Expo Router `Stack`.
- `src/app/index.tsx`: component showcase.
- `src/components/theme-switcher.tsx`: style chips and mode toggle built from `useTheme()`.
- `src/styles/custom-themes.ts`: example app-defined theme.

## Status

Checked by bundling for web and iOS (Hermes) and by driving the web build in a browser at phone width. Not yet run on a physical device, simulator or Android.
