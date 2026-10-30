# bokoui

Themeable UI components for React, Vue and React Native (Expo) on Tailwind CSS v4, with eight design styles (Flat, Material, Swiss, Brutalism, Neo-Brutalism, Monochrome, OLED, Fluent), each in light and dark mode. Style and mode are independent and switchable at runtime.

## Repository layout

This repo holds two separate projects, each with its own `package.json`, `node_modules` and lockfile (no workspaces). Run npm commands inside the project directory.

| Path | What it is |
|---|---|
| [packages/bokoui](packages/bokoui) | The library, published to npm as `bokoui`. Components, themes and styles live here. |
| [examples/next-js](examples/next-js) | Next.js demo using `bokoui/react`. |
| [examples/nuxt-js](examples/nuxt-js) | Nuxt demo using `bokoui/vue`. |
| [examples/nuxt-js-layouts](examples/nuxt-js-layouts) | Nuxt application shell (sidebar, drawer, organizations, roles, i18n) using `bokoui/vue`. |
| [examples/expo-js](examples/expo-js) | Expo demo using `bokoui/expo`; its README has the install and usage guide. |
| [examples/next-js-layouts](examples/next-js-layouts) | Next.js application shell (sidebar, header, footer, mobile navigation, organizations, roles, i18n). |
| [examples/expo-js-layouts](examples/expo-js-layouts) | The same shell on Expo. |
| [examples/showcase](examples/showcase) | Plain-HTML landing page that links the hosted demos; `run.sh` serves it on :3000. |
| [docs](docs) | [SRS](docs/srs/srs-ui-framework.md), [task list](docs/tasks/tasks-ui-framework.md), [component status](docs/component-status.md), [component conventions](docs/component-conventions.md), [Tailwind plan](docs/plan-tailwindcss.md). |

## Quick start

```bash
# 1. Build the library
cd packages/bokoui
npm install
npm run build

# 2. Publish to local Verdaccio and run every example (fixed ports: showcase :3000, Expo web :3001, Next :3002, Nuxt :3003, the extra next-js-layouts :3004, nuxt-js-layouts :3006)
cd ../..
./run.sh
```

`run.sh` builds and publishes the library (bumping the patch version if needed), points each example at it, installs, and starts them concurrently. `./run.sh build` only builds and publishes the library; `./run.sh show` only installs the last published version into every example and runs them.

Each demo has a **React / Vue / Expo switcher** in its header that opens the same page in the other demos (or their home when they have no matching page). The ports are fixed for this reason; `run.sh` passes the URLs to each app (`NEXT_PUBLIC_BOKOUI_URL_*`, `NUXT_PUBLIC_URL_*`, `EXPO_PUBLIC_BOKOUI_URL_*`), and the defaults in the code match the ports above, so a single `npm run dev` still works. Change a port with `BOKOUI_PORT_REACT`, `BOKOUI_PORT_VUE` or `BOKOUI_PORT_EXPO`. The switcher hides the Expo link on a native device (a localhost link means nothing there).

The demos install `bokoui` from the registry set in its `.npmrc` (a local Verdaccio at `http://127.0.0.1:4873/`). To try library changes in the demo, bump the version in `packages/bokoui/package.json`, run `npm run publish:local`, then update the dependency in the demo (`run.sh` does all of this).

## Status

React is the reference platform and is feature-complete for the current scope: about 50 components, 8 styles x light/dark, axe-clean across every page and style. Vue has every React component; Expo has the primitives. [docs/component-status.md](docs/component-status.md) is the source of truth for what exists per platform and what is left.

The Next.js demo (`examples/next-js`) is also the playground: every component has a page with variants, states and a generated API table, and Cmd/Ctrl+K opens a command palette.

## Usage

One package, one entry per platform: `bokoui/react`, `bokoui/vue`, `bokoui/expo` (plus framework-neutral `bokoui/core`). See the [library README](packages/bokoui/README.md) for setup and theming.

## License

MIT
