# bokoui Expo example

Demo app for [bokoui](../../packages/bokoui) using `bokoui/expo`, built with Expo (SDK 57) and Expo Router. It shows the same page as the [Next.js](../next-js) and [Nuxt](../nuxt-js) examples: style and mode switcher, every Button variant and Input state, typography and a custom theme. There is no Tailwind or CSS here; the components paint themselves from the same theme tokens.

## Run

```bash
npm install
npm run dev          # Metro on :8081 (or $PORT); press w for web, i for iOS, a for Android
npm run web          # web only
```

`bokoui` is installed from the registry in `.npmrc` (local Verdaccio, `http://127.0.0.1:4873/`). From the repo root, `./run.sh` publishes the library there and runs every example on its own port.

## Structure

- `src/app/_layout.tsx`: `ThemeProvider` from `bokoui/expo` (with `AsyncStorage` to persist the choice and the custom theme) around an Expo Router `Stack`.
- `src/app/index.tsx`: component showcase.
- `src/components/theme-switcher.tsx`: style chips and mode toggle built from `useTheme()`.
- `src/styles/custom-themes.ts`: example app-defined theme.

## Status

Checked by bundling for web and iOS (Hermes) and by driving the web build in a browser at phone width. Not yet run on a physical device, simulator or Android.
