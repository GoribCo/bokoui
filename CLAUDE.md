@AGENTS.md

# Project: bokoui (Tailwind CSS v4 + Next.js UI framework)

Themeable React components with 8 design styles (flat, material, swiss, brutalism, neo-brutalism, monochrome, oled, fluent) and light/dark modes. Style (`data-theme`) and mode (`data-mode`) are independent axes on `<html>`.

Docs: [SRS](docs/srs/srs-ui-framework.md), [task list](docs/tasks/tasks-ui-framework.md) (update checkboxes when finishing a task), [layout plan](docs/plan-layouts.md), [Tailwind plan](docs/plan-tailwindcss.md).

## Repository layout

This is a two-part repo: a Next.js demo app at the root that consumes the `bokoui` library in `packages/bokoui`.

- `packages/bokoui/` is the library (published to npm as `bokoui`). **All component, theme and style source lives here**, not in the root `src/`.
  - `src/components/ui/`: primitives (Button, Input), shared variant types in `types.ts`
  - `src/components/theme/`: `ThemeProvider`, `ThemeSwitcher`, `ThemeScript`, `apply-theme`, `themes` registry
  - `src/styles/`: `bokoui.css` (entry), `tokens.css`, `themes/*.css` (one file per style)
  - `src/lib/cn.ts`: `clsx` + `tailwind-merge` helper
  - `src/index.ts`, `theme.ts`, `theme-script.ts`: package entry points (`bokoui`, `bokoui/theme`, `bokoui/theme-script`, `bokoui/styles.css`)
  - `scripts/postbuild.mjs`: inlines CSS `@import`s into `dist/styles.css`, adds `@source "./"`, and prepends `"use client"` to `dist/theme.js`
- Root `src/app/` is the demo app. It imports from the built package (`bokoui/theme`, `bokoui/theme-script`, `bokoui/styles.css`), not from relative paths. `src/styles/custom-themes.ts` holds app-defined custom themes.
- `scripts/audit-contrast.mjs`: contrast audit for every style/mode pair. `scripts/publish-local.sh`: publish to local Verdaccio.

The root `tsconfig.json` excludes `packages`; the package has its own `tsconfig.json`. `@/*` maps to root `./src/*` only.

## Commands

- `npm run dev` / `build` / `start`: Next.js demo app
- `npm run lint`, `npm run typecheck`: root app checks (run both before finishing)
- `npm run build:pkg`: build the library with tsup (+ postbuild) into `packages/bokoui/dist` (gitignored)
- `npm run publish:local`: build and publish `bokoui` to Verdaccio at `http://127.0.0.1:4873/` (registry set in `.npmrc`). Bump the version in `packages/bokoui/package.json` first (`npm version patch`); the root `package.json` dependency `bokoui` must match a published version.
- `node scripts/audit-contrast.mjs`: run after changing any theme tokens

Because the demo app consumes the built package, rebuild (`npm run build:pkg`) after editing anything under `packages/bokoui/src` before checking it in the app.

## Conventions

- Next.js here is 16.x with breaking changes: read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code.
- TypeScript `strict` is on; no `any`.
- Components: typed variants via `class-variance-authority` (color, variant, action, size), `forwardRef`, merge `className` with `cn()`, accessible states (hover/focus/active/disabled/loading/error). Use `"use client"` only when a component needs it. Button is the reference implementation.
- Styling goes through design tokens (CSS variables in `tokens.css`, mapped to Tailwind v4 `@theme`); never hard-code colors in components. A new style is a new file in `styles/themes/`, imported from `themes/index.css` and registered in `themes.ts`.
- Respect `prefers-reduced-motion`. Avoid theme flash: `ThemeScript` must stay in `<head>`.
- Export new components through the per-folder `index.ts` and `packages/bokoui/src/index.ts`.

## Status

Done: foundation, theming engine, 8 core styles, Button, Input, package extraction into `packages/bokoui`, local Verdaccio publishing. Next up: remaining primitives (T4.3 onward), playground, tests. See the task list for the current state.
