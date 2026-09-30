# bokoui

Themeable UI components for React, Vue and React Native (Expo) on Tailwind CSS v4, with eight design styles (Flat, Material, Swiss, Brutalism, Neo-Brutalism, Monochrome, OLED, Fluent), each in light and dark mode. Style and mode are independent and switchable at runtime.

## Repository layout

This repo holds two separate projects, each with its own `package.json`, `node_modules` and lockfile (no workspaces). Run npm commands inside the project directory.

| Path | What it is |
|---|---|
| [packages/bokoui](packages/bokoui) | The library, published to npm as `bokoui`. Components, themes and styles live here. |
| [examples/next-js](examples/next-js) | Next.js demo using `bokoui/react`. |
| [examples/nuxt-js](examples/nuxt-js) | Nuxt demo using `bokoui/vue`. |
| [examples/expo-js](examples/expo-js) | Expo demo using `bokoui/expo`. |
| [docs](docs) | [SRS](docs/srs/srs-ui-framework.md), [task list](docs/tasks/tasks-ui-framework.md), [layout plan](docs/plan-layouts.md), [Tailwind plan](docs/plan-tailwindcss.md). |

## Quick start

```bash
# 1. Build the library
cd packages/bokoui
npm install
npm run build

# 2. Publish to local Verdaccio and run every example (Expo web on :3000, Next on :3001, Nuxt on :3002)
cd ../..
./run.sh
```

`run.sh` builds and publishes the library (bumping the patch version if needed), points each example at it, installs, and starts them concurrently. `./run.sh --no-publish` skips the build and publish.

The demos install `bokoui` from the registry set in its `.npmrc` (a local Verdaccio at `http://127.0.0.1:4873/`). To try library changes in the demo, bump the version in `packages/bokoui/package.json`, run `npm run publish:local`, then update the dependency in the demo (`run.sh` does all of this).

## Usage

One package, one entry per platform: `bokoui/react`, `bokoui/vue`, `bokoui/expo` (plus framework-neutral `bokoui/core`). See the [library README](packages/bokoui/README.md) for setup and theming.

## License

MIT
