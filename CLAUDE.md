@AGENTS.md

# Project: bokoui (Tailwind CSS v4 + Next.js UI framework)

Themeable React components with 8 design styles (flat, material, swiss, brutalism, neo-brutalism, monochrome, oled, fluent) and light/dark modes. Style (`data-theme`) and mode (`data-mode`) are independent axes on `<html>`.

Docs: [SRS](docs/srs/srs-ui-framework.md), [task list](docs/tasks/tasks-ui-framework.md) (update checkboxes when finishing a task), [layout plan](docs/plan-layouts.md), [Tailwind plan](docs/plan-tailwindcss.md).

## Repository layout

Separate installs, no root `package.json` or workspaces. Each of the two projects has its own `package.json`, `node_modules` and lockfile. Run npm commands from inside the project directory.

- `packages/bokoui/` is the library (published to npm as `bokoui`): one package, one entry per platform. **All component, theme and style source lives here.**
  - `src/core/`: framework-neutral. cva class recipes (`recipes/`), `responsive.ts`, shared types, theme registry/engine (`themes.ts`, `apply-theme.ts`, `theme-storage.ts`, `theme-script.ts`), `cn`, icon data. No React or Vue imports. Entry `bokoui/core`.
  - `src/react/`: thin React bindings over core (`ui/`, `theme/`). Entries `bokoui/react`, `bokoui/react/theme` (client), `bokoui/react/theme-script`.
  - `src/vue/`: Vue 3 bindings (render functions, no SFCs). Entry `bokoui/vue`.
  - `src/expo/`: React Native bindings. Styling comes from `tokens.generated.ts` (generated from the theme CSS by `scripts/build-tokens.mjs`; do not edit). Entry `bokoui/expo`.
  - `src/styles/`: `bokoui.css` (entry), `tokens.css`, `themes/*.css` (one file per style). Entry `bokoui/styles.css`; `bokoui/tokens.json` is generated into `dist`.
  - `scripts/`: `postbuild.mjs` (inlines CSS `@import`s, adds `@source "./"`, prepends `"use client"` to `dist/react/theme.js`), `build-tokens.mjs`, `audit-contrast.mjs`, `publish-local.sh`.
- `examples/next-js/` is the Next.js demo (`bokoui/react`); `examples/nuxt-js/` is the Nuxt demo (`bokoui/vue`). Both import from the installed `bokoui` package, not relative paths.
- `run.sh` (root): build + publish the library to Verdaccio, then run every example concurrently (ports 3000, 3001, ...).

`@/*` maps to `./src/*` within each project.

## Commands

In `packages/bokoui/` (first run `npm install`):
- `npm run build`: tokens + tsup + postbuild into `dist` (gitignored)
- `npm run typecheck`
- `npm run audit`: contrast audit; run after changing any theme tokens
- `npm run publish:local`: build and publish `bokoui` to Verdaccio at `http://127.0.0.1:4873/` (registry set in `.npmrc`). Bump the version first (`npm version patch`); the example's `bokoui` dependency must match a published version.

In `examples/next-js/` (and `examples/nuxt-js/`: `npm run dev` / `build`):
- `npm run dev` / `build` / `start`: Next.js demo app
- `npm run lint`, `npm run typecheck`: run both before finishing
- `npm run build:pkg` / `publish:local`: shortcuts that run the library commands above

The demo app consumes the published package from `node_modules`, so after editing `packages/bokoui/src`, publish a new version locally and update it in the example before checking it there.

## Conventions

- Next.js here is 16.x with breaking changes: read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code.
- TypeScript `strict` is on; no `any`.
- Components: typed variants via `class-variance-authority` (color, variant, action, size), `forwardRef`, merge `className` with `cn()`, accessible states (hover/focus/active/disabled/loading/error). Use `"use client"` only when a component needs it. Button is the reference implementation.
- Styling goes through design tokens (CSS variables in `tokens.css`, mapped to Tailwind v4 `@theme`); never hard-code colors in components. A new style is a new file in `styles/themes/`, imported from `themes/index.css` and registered in `themes.ts`.
- Respect `prefers-reduced-motion`. Avoid theme flash: `ThemeScript` must stay in `<head>`.
- A new component is a class recipe in `src/core/recipes/` plus a thin binding in each of `src/react`, `src/vue`, `src/expo`; export it from that folder's `index.ts`. Keep React/Vue/RN imports out of `core`.

## Status

Done: foundation, theming engine, 8 core styles, Button, Input, Heading/Text/Link, one package with `core`/`react`/`vue`/`expo` entries (Expo untested on a device), Next and Nuxt examples, local Verdaccio publishing. Next up: remaining primitives (T4.3 onward), playground, tests. See the task list for the current state.
