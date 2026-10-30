@AGENTS.md

# Project: bokoui (Tailwind CSS v4 + Next.js UI framework)

Themeable React components with 20 design styles (flat, material, swiss, brutalism, neo-brutalism, monochrome, oled, fluent, plus the material styles minimalism, bento, material-3, soft-ui, neumorphism, claymorphism, skeuomorphism, terminal, synthwave, glassmorphism, liquid-glass, aurora) and light/dark modes. Style (`data-theme`) and mode (`data-mode`) are independent axes on `<html>`.

Docs: [SRS](docs/srs/srs-ui-framework.md), [task list](docs/tasks/tasks-ui-framework.md) (update checkboxes when finishing a task), [component conventions](docs/component-conventions.md), [layout plan](docs/plan-layouts.md), [Tailwind plan](docs/plan-tailwindcss.md).

## Repository layout

Separate installs, no root `package.json` or workspaces. Each of the two projects has its own `package.json`, `node_modules` and lockfile. Run npm commands from inside the project directory.

- `packages/bokoui/` is the library (published to npm as `bokoui`): one package, one entry per platform. **All component, theme and style source lives here.**
  - `src/core/`: framework-neutral. cva class recipes (`recipes/`), `responsive.ts`, shared types, theme registry/engine (`themes.ts`, `apply-theme.ts`, `theme-storage.ts`, `theme-script.ts`), `cn`, icon data. No React or Vue imports. Entry `bokoui/core`.
  - `src/react/`: thin React bindings over core: `ui/` (basic elements), `blocks/` (composed), `internal/`, `theme/`. One file per component; a stateful one starts with `"use client";`. Entries `bokoui/react` (everything), `bokoui/react/ui`, `bokoui/react/blocks`, `bokoui/react/theme` (client), `bokoui/react/theme-script`; `bokoui/react/client` is a compatibility entry. Apps never import `bokoui/core`: `src/core/public.ts` is what `bokoui/react` re-exports.
  - `src/vue/`: Vue 3 bindings (render functions, no SFCs). Entry `bokoui/vue`.
  - `src/expo/`: React Native bindings in `ui/` and `blocks/`. Styling comes from `tokens.generated.ts` (generated from the theme CSS by `scripts/build-tokens.mjs`; do not edit) and, for the twelve material styles, `styles/*.ts`. Entries `bokoui/expo`, `bokoui/expo/ui`, `bokoui/expo/blocks`.
  - `src/styles/`: `bokoui.css` (entry), `tokens.css`, `themes/*.css` (one file per style). Entry `bokoui/styles.css`; `bokoui/tokens.json` is generated into `dist`.
  - `test/`: every test of the library, beside `src` (`core`, `react/ui`, `react/blocks`, `vue`, `a11y`, `structure`, `helpers`). Tests import `@/...`; `examples/next-js-layouts/test/` follows the same layout (`unit/`, `browser/`).
  - `scripts/`: `postbuild.mjs` (inlines CSS `@import`s, adds `@source "./"`, puts `"use client"` on the stateful React entries and writes the React barrels), `check-client-boundaries.mjs`, `build-tokens.mjs`, `sync-expo-styles.mjs`, `audit-contrast.mjs`, `publish-local.sh`.
- `examples/next-js/` is the Next.js demo (`bokoui/react`); `examples/nuxt-js/` is the Nuxt demo (`bokoui/vue`); `examples/expo-js/` is the Expo demo (`bokoui/expo`, has its own AGENTS.md: read the Expo docs before touching Expo APIs). All import from the installed `bokoui` package, not relative paths.
- `examples/next-js-layouts/` is the generic application shell (sidebar, header, footer, mobile navigation, org switching, roles, i18n) on `bokoui/react`; all data is mock data behind `src/services`. Specs: [SRS](docs/srs/srs-layouts.md), [tasks](docs/tasks/tasks-layouts.md). Has its own `package.json`, `node_modules` and lockfile like the others.
- `examples/nuxt-js-layouts/` is a reduced Nuxt port of the application shell on `bokoui/vue` (sidebar tree, drawer, org switching, roles, en/bn; mock data behind `app/services`; no sign-in, API or query). Own `package.json`, `node_modules` and lockfile.
- `examples/expo-js-layouts/` is the same application shell on `bokoui/expo` (expo-router, in-process sample API, Zustand, TanStack Query, i18next). Task list: [tasks-layouts-expo](docs/tasks/tasks-layouts-expo.md). Has its own `AGENTS.md`: read the Expo docs before touching Expo APIs.
- `run.sh` (root): build + publish the library to Verdaccio, then run every example concurrently (fixed ports: showcase 3000, expo-js 3001, next-js 3002, nuxt-js 3003, next-js-layouts 3004, expo-js-layouts 3005, nuxt-js-layouts 3006).

`@/*` maps to `./src/*` within each project.

## Commands

In `packages/bokoui/` (first run `npm install`):
- `npm run build`: tokens + tsup + postbuild into `dist` (gitignored)
- `npm run typecheck`
- `npm run audit`: contrast audit; run after changing any theme tokens
- `npm run publish:local`: build and publish `bokoui` to Verdaccio at `http://127.0.0.1:4873/` (registry set in `.npmrc`). Bump the version first (`npm version patch`); the example's `bokoui` dependency must match a published version.

In `examples/next-js/` (`examples/nuxt-js/` and `examples/expo-js/`: `npm run dev`):
- `npm run dev` / `build` / `start`: Next.js demo app
- `npm run lint`, `npm run typecheck`: run both before finishing
- `npm run build:pkg` / `publish:local`: shortcuts that run the library commands above

The demo app consumes the published package from `node_modules`, so after editing `packages/bokoui/src`, publish a new version locally and update it in the example before checking it there.

## Conventions

- Next.js here is 16.x with breaking changes: read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code.
- TypeScript `strict` is on; no `any`.
- Components: typed variants via `class-variance-authority` (color, variant, action, size), `forwardRef`, merge `className` with `cn()`, accessible states (hover/focus/active/disabled/loading/error). Use `"use client"` only when a component needs it. Button is the reference implementation.
- Styling goes through design tokens (CSS variables in `tokens.css`, mapped to Tailwind v4 `@theme`); never hard-code colors in components. A new style is a new file in `styles/themes/`, imported from `themes/index.css` and registered in `themes.ts`. The twelve material styles are the exception: edit `src/expo/styles/<id>.ts` and run `node scripts/sync-expo-styles.mjs`, which writes their CSS.
- Respect `prefers-reduced-motion`. Avoid theme flash: `ThemeScript` must stay in `<head>`.
- A new component is a class recipe in `src/core/recipes/` plus a thin binding in each of `src/react`, `src/vue`, `src/expo`; export it from that folder's `index.ts`. Keep React/Vue/RN imports out of `core`.

## Status

Done: foundation, theming engine, 8 core styles, Button, Input, Heading/Text/Link, one package with `core`/`react`/`vue`/`expo` entries (Expo untested on a device), Next and Nuxt examples, local Verdaccio publishing. Next up: remaining primitives (T4.3 onward), playground, tests. See the task list for the current state.
