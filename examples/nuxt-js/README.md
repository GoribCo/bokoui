# bokoui Nuxt example

Demo app for [bokoui](../../packages/bokoui) using `bokoui/vue`, built with Nuxt 4 and Tailwind CSS v4. It shows the same page as [the Next.js example](../next-js): theme switcher, every Button variant and Input state, responsive props, typography and a custom theme.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
```

`bokoui` is installed from the registry in `.npmrc` (local Verdaccio, `http://127.0.0.1:4873/`). From the repo root, `./run.sh` publishes the library there and runs every example on its own port.

## Structure

- `nuxt.config.ts`: Tailwind via `@tailwindcss/vite`.
- `app/assets/css/main.css`: imports Tailwind, `bokoui/styles.css` and the fonts (bokoui ships none).
- `app/app.vue`: theme script in `<head>` (no flash), `ThemeProvider`, `ThemeSwitcher`.
- `app/pages/`: showcase pages (`index`, `forms`, `display`, `feedback`, `data`, `navigation`, `pickers`, `overlays`, `tabs`, `setup`); `ToastProvider` wraps the app in `app.vue`.
- `app/utils/custom-themes.ts`: example app-defined theme.

## Application shell

For a full app layout (sidebar tree, drawer, organizations, roles, en/bn) see [nuxt-js-layouts](../nuxt-js-layouts). The complete version is [next-js-layouts](../next-js-layouts); [expo-js-layouts](../expo-js-layouts) is the Expo one.
