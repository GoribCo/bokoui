# Contributing

Thanks for helping. This project has two independent parts (`packages/bokoui`, the library, and `examples/*`, the demos), each with its own `package.json`, `node_modules` and lockfile. Run npm commands inside the project you are changing.

## Setup

```bash
cd packages/bokoui
npm install
npm test          # unit, accessibility and server-rendering tests
npm run typecheck
npm run build     # tokens, bundles, CSS, tokens.json, props.json
npm run audit     # contrast, for every style x mode
```

To see a change in the demos, publish to the local registry and reinstall (`./run.sh` does all of it and clears the Next.js cache): bump the version (`npm version patch`), `npm run publish:local`, then update the example's `bokoui` dependency.

When you add a page to the Vue or Expo demo, add its path to that platform's list in the switcher (`examples/next-js/src/components/platform-switcher.tsx`, `examples/nuxt-js/app/components/PlatformSwitcher.vue`, `examples/expo-js/src/components/platform-switcher.tsx`); until then the other demos link to its home.

## Read first

- [docs/component-conventions.md](docs/component-conventions.md): architecture, prop names, states, the server/client split, and the **add-a-component checklist**.
- [docs/component-status.md](docs/component-status.md): what exists per platform, and what is left. Update it in the same change.

## Working rules

- **React first**: build and verify a component in `bokoui/react` and the Next.js demo, then port to Vue and Expo. Record any gap in `docs/component-status.md`.
- **Tokens, not colors**: components never hard-code colors; they use the tone variables (`--tone`, `--tone-ink`, ...).
- **Class names must be complete literals** in the source. Tailwind cannot see names built with template strings, so they silently produce no CSS. A test enforces this for recipes.
- **Test what jsdom cannot see in a browser.** Tests run in jsdom (no layout, no CSS, no Popover API). Anything about focus, layout, top layer or contrast needs a look in a real browser. Several bugs only showed up there; each now has a regression test.
- **Vue components must render on the server** (Nuxt): no `window` or `document` in `setup` or immediate watchers. `src/vue/ssr.test.ts` renders each stateful component in Node.
- **Accessibility is a requirement**: keyboard operable, visible focus, correct roles and names. Add the component to `src/test/a11y.test.tsx`. Run `npm run audit` after touching theme tokens.
- **No `any`**; TypeScript is strict.

## Adding a style

Add `src/styles/themes/<name>.css` (start from an existing file; `flat.css` defines the full token schema and is the fallback), import it in `themes/index.css`, register it in `src/core/themes.ts`, then run `npm run tokens` and `npm run audit`.

## Commits and pull requests

Small, focused changes. Describe what changed and how you verified it (tests, and which browser and styles you looked at for visual changes). Update `CHANGELOG.md` under "Unreleased".
