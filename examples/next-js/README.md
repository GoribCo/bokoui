# bokoui Next.js example

Demo app for [bokoui](../../packages/bokoui) using `bokoui/react`, built with Next.js (App Router) and Tailwind CSS v4. It shows the theme switcher, every Button variant and Input state, and a custom theme.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
```

`bokoui` is installed from the registry in `.npmrc` (local Verdaccio, `http://127.0.0.1:4873/`), so start Verdaccio and publish the library first if the version in `package.json` isn't available (see [Working on the library](#working-on-the-library)).

## Scripts

| Script | Does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js dev server, production build, production server |
| `npm run lint` / `typecheck` | ESLint, `tsc --noEmit` |
| `npm run build:pkg` | Build the library in `../../packages/bokoui` |
| `npm run publish:local` | Build and publish the library to local Verdaccio |

## Structure

- `src/app/layout.tsx`: `ThemeScript` in `<head>`, `ThemeProvider` and `ThemeSwitcher` around the app.
- `src/app/page.tsx`: component showcase.
- `src/app/globals.css`: imports Tailwind and `bokoui/styles.css`.
- `src/styles/custom-themes.ts`: example app-defined theme.

## Working on the library

1. Edit `packages/bokoui/src`.
2. Bump the version (`npm version patch` in `packages/bokoui`) and run `npm run publish:local` here.
3. Set the new `bokoui` version in this `package.json` and run `npm install`.

## Application shell

For a full app layout (sidebar, header, footer, mobile navigation, organizations, roles, i18n) see [next-js-layouts](../next-js-layouts). The same shell exists for [Vue/Nuxt](../nuxt-js-layouts) and [Expo](../expo-js-layouts).
