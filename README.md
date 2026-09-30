# bokoui

Themeable React components for Tailwind CSS v4 with eight design styles (Flat, Material, Swiss, Brutalism, Neo-Brutalism, Monochrome, OLED, Fluent), each in light and dark mode. Style and mode are independent and switchable at runtime.

## Repository layout

This repo holds two separate projects, each with its own `package.json`, `node_modules` and lockfile (no workspaces). Run npm commands inside the project directory.

| Path | What it is |
|---|---|
| [packages/bokoui](packages/bokoui) | The library, published to npm as `bokoui`. Components, themes and styles live here. |
| [examples/next-js](examples/next-js) | Next.js demo app that consumes the published `bokoui` package. |
| [docs](docs) | [SRS](docs/srs/srs-ui-framework.md), [task list](docs/tasks/tasks-ui-framework.md), [layout plan](docs/plan-layouts.md), [Tailwind plan](docs/plan-tailwindcss.md). |

## Quick start

```bash
# 1. Build the library
cd packages/bokoui
npm install
npm run build

# 2. Run the demo app
cd ../../examples/next-js
npm install
npm run dev
```

The demo installs `bokoui` from the registry set in its `.npmrc` (a local Verdaccio at `http://127.0.0.1:4873/`). To try library changes in the demo, bump the version in `packages/bokoui/package.json`, run `npm run publish:local`, then update the dependency in the demo.

## Usage

See the [library README](packages/bokoui/README.md) for installation, setup and theming.

## License

MIT
