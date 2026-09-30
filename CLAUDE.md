@AGENTS.md

# Project: bokoui (Tailwind CSS v4 + Next.js UI framework)

Themeable React components with 8 design styles (flat, material, swiss, brutalism, neo-brutalism, monochrome, oled, fluent) and light/dark modes. Style (`data-theme`) and mode (`data-mode`) are independent axes on `<html>`.

Docs: [SRS](docs/srs/srs-ui-framework.md), [task list](docs/tasks/tasks-ui-framework.md) (update checkboxes when finishing a task), [layout plan](docs/plan-layouts.md), [Tailwind plan](docs/plan-tailwindcss.md).

## Repository layout

Separate installs, no root `package.json` or workspaces. Each of the two projects has its own `package.json`, `node_modules` and lockfile. Run npm commands from inside the project directory.

- `packages/bokoui/` is the library (published to npm as `bokoui`). **All component, theme and style source lives here.**
  - `src/components/ui/`: primitives (Button, Input), shared variant types in `types.ts`
  - `src/components/theme/`: `ThemeProvider`, `ThemeSwitcher`, `ThemeScript`, `apply-theme`, `themes` registry
  - `src/styles/`: `bokoui.css` (entry), `tokens.css`, `themes/*.css` (one file per style)
  - `src/lib/cn.ts`: `clsx` + `tailwind-merge` helper
  - `src/index.ts`, `theme.ts`, `theme-script.ts`: package entry points (`bokoui`, `bokoui/theme`, `bokoui/theme-script`, `bokoui/styles.css`)
  - `scripts/postbuild.mjs`: inlines CSS `@import`s into `dist/styles.css`, adds `@source "./"`, and prepends `"use client"` to `dist/theme.js`
  - `scripts/audit-contrast.mjs`: contrast audit for every style/mode pair. `scripts/publish-local.sh`: publish to local Verdaccio.
- `examples/next-js/` is the Next.js demo app. Its `src/app/` imports from the installed `bokoui` package (`bokoui/theme`, `bokoui/theme-script`, `bokoui/styles.css`), not from relative paths. `src/styles/custom-themes.ts` holds app-defined custom themes.
- `examples/nuxt-js/` is not started.

`@/*` maps to `./src/*` within each project.

## Commands

In `packages/bokoui/` (first run `npm install`):
- `npm run build`: build with tsup (+ postbuild) into `dist` (gitignored)
- `npm run typecheck`
- `npm run audit`: contrast audit; run after changing any theme tokens
- `npm run publish:local`: build and publish `bokoui` to Verdaccio at `http://127.0.0.1:4873/` (registry set in `.npmrc`). Bump the version first (`npm version patch`); the example's `bokoui` dependency must match a published version.

In `examples/next-js/`:
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
- Export new components through the per-folder `index.ts` and `packages/bokoui/src/index.ts`.

## Status

Done: foundation, theming engine, 8 core styles, Button, Input, package extraction into `packages/bokoui`, local Verdaccio publishing. Next up: remaining primitives (T4.3 onward), playground, tests. See the task list for the current state.
