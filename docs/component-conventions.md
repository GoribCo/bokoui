# Component conventions

The rules every bokoui component follows, and the checklist for adding one. Button (`core/recipes/button.ts`, `react/ui/button/`) and Input are the reference implementations.

## Architecture

A component is one class recipe in core plus a thin binding per platform:

| Layer | Path | Contains |
| --- | --- | --- |
| Recipe | `src/core/recipes/<name>.ts` | `cva` variants, `<name>Class()` helper, `<Name>StyleProps` type. No React/Vue imports. |
| React | `src/react/ui/<name>/<name>.tsx` | `forwardRef`, calls the recipe, sets `data-*`/`aria-*`. |
| Vue | `src/vue/<name>.ts` | `defineComponent` with a render function (no SFCs), same recipe. |
| Expo | `src/expo/components.tsx` | Styles from `tokens.generated.ts` (no Tailwind classes). |

Bindings hold no styling decisions. If two bindings would need the same `if`, it belongs in the recipe.

## Prop vocabulary

Use these names and values; do not invent synonyms.

| Prop | Values | Notes |
| --- | --- | --- |
| `variant` | `solid` `outline` `soft` `ghost` `link` (`Variant`) | A component may use a subset or its own union (Input: `outline` `filled` `flushed`). Keep `outline` and `soft` meaning the same thing everywhere. |
| `color` | `primary` `secondary` `accent` `neutral` (`Color`) | Brand palette slot. Default `primary`. |
| `action` | `success` `warning` `danger` `info` (`Action`) | Semantic intent. Overrides `color`. |
| `size` | `sm` `md` `lg` (`Size`) | Default `md`. Accept `Responsive<Size>` where the component has a height. |
| `fullWidth` | `boolean` or responsive map | Only for components that are inline by default. |
| `className` (React) / `class` (Vue) | string | Always merged last with `cn()`. |
| `containerClassName` (React) / `containerClass` (Vue) | string | For a wrapper element, when a component renders one. |

Color is never a variant. Every component resolves `color` + `action` with `resolveTone()` and sets `data-tone` on its root. The recipe paints with `--tone`, `--tone-fg`, `--tone-soft`, `--tone-soft-hover`, `--tone-ink` and `--tone-border` (defined in `styles/tokens.css`), so the matrix is variant x size and never multiplies by tone.

## States

| State | How it is expressed | Rule |
| --- | --- | --- |
| hover / active | `enabled:hover:` / `enabled:active:` in the recipe | Never on disabled elements. Use the `--bokoui-hover-mix` / `--bokoui-active-mix` tokens. |
| focus | `focus-ring` utility (`:focus-visible`) | Never remove the outline without replacing it. |
| disabled | native `disabled` + `disabled:` classes using `--bokoui-disabled-opacity` | Non-form elements use `aria-disabled`. |
| loading | prop `loading`; `data-loading`, `aria-busy`, and disabled | Show the `icons.loader` spinner with `motion-reduce:animate-pulse`. |
| invalid | prop `invalid`; `aria-invalid="true"`, tone forced to `danger` | Danger wins over `action`. Style via `aria-invalid:`, not a class. |
| read-only | native `readOnly`, `read-only:` classes | Form controls only. |
| checked / selected / open | native attribute or `aria-*`/`data-state` | Style with attribute selectors, not extra props. |

## Rules

- Colors, radii, borders, shadows, durations come from tokens (CSS variables mapped in `@theme`). No hard-coded colors or `px` radii.
- Touch targets: interactive controls carry `pointer-coarse:min-h-11`.
- Motion: gate with `motion-reduce:`; use `--bokoui-duration` and `ease-ui`.
- Logical properties for direction-sensitive spacing (`ps-*`, `pe-*`, `start-*`, `end-*`) so RTL works.
- Spread `...props` last on the element (after the computed attributes you need to keep) so callers can add `aria-*`, `data-*`, and handlers. Attributes the component owns (`data-tone`, `aria-invalid`) come from the component, not from the caller's props.
- `forwardRef` to the element a caller would expect to focus or measure.
- `"use client"` only if the React component uses hooks or browser APIs. `react/theme` is the only current client entry.
- No `any`. Export the `Props` type next to the component.
- Accessible name: icon-only and image-only controls require `aria-label` (document it in the prop's JSDoc).

## Overlays and focus (decision)

No headless UI dependency (no Radix, Base UI or similar). Overlay components use browser primitives, plus our own small logic where the browser has none:

| Component | Approach |
| --- | --- |
| Modal / Dialog | Native `<dialog>` with `showModal()`. The browser gives focus trap, top layer, `Esc` and `inert` background. We add the backdrop styling, scroll lock and focus return. |
| Tooltip, Popover, Dropdown panel | Popover API (`popover` attribute, `popovertarget`) in the top layer. Positioning uses CSS anchor positioning where supported, with a small fallback that positions from `getBoundingClientRect()`. |
| Select, Menu, Tabs | Custom keyboard logic (arrows, Home/End, typeahead, `Esc`) written once in `src/core` as framework-neutral functions, then wired by each binding. Follow the WAI-ARIA Authoring Practices patterns. |

Consequences:

- Shared behavior goes in `src/core/` as plain functions (no React/Vue imports), for example `getNextIndex()` for roving focus and typeahead matching. Bindings only connect them to events and refs.
- Vue components must render on the server (Nuxt): never touch `window`/`document` during `setup` or in an immediate watcher. `src/vue/ssr.test.ts` renders each stateful component in a Node environment to catch this.
- jsdom does not implement `showModal()` or the Popover API. Tests stub them in `vitest.setup.ts`; real behavior needs a browser check (T6.3/T6.4).
- Verify browser support for `<dialog>`, Popover and anchor positioning against the project's target browsers (T6.6) before shipping each component.

## Platform support

Web (React, Vue) is the primary target. Expo gets a component only when it makes sense natively.

| Kind | React | Vue | Expo |
| --- | --- | --- | --- |
| Primitives (Button, Input, Textarea, Badge, Avatar, Divider, Card, Spinner, Alert, Label, FormField, Checkbox, Radio, Switch, Icon) | yes | yes | yes |
| Overlays and composites (Modal, Tooltip, Select, Menu, Tabs, Popover) | yes | yes | Modal only. Others wait for a native design (Tooltip has no touch equivalent). |
| Web-only (Image wrapper over `next/image`, Navbar, Sidebar, Table, Breadcrumb, Pagination) | yes | yes where framework-neutral | no |

Rules:

- Build and ship React first, then port to Vue in the same change, since the recipe is shared. Expo follows for the rows marked yes.
- When a component skips a platform, record it in the task list next to the task so the gap is visible.
- `Image` wraps `next/image`, which ties it to Next. Ship it from the example or an adapter entry, not from `bokoui/core`.

## Server-safe vs client components (React)

`bokoui/react` holds components with no state or effects (Button, Input, Card, ...). They work in Next.js Server Components.

Components that need state, effects or browser APIs (Tabs, Modal, Tooltip, Menu, Select) live in `src/react/client/` and are exported from `bokoui/react/client`, which `scripts/postbuild.mjs` marks `"use client"`. Do not put hooks in `src/react/ui/`. Stateless helpers that only need a few ids can use `useId` (allowed on the server) instead.

Shared hooks for overlays are in `src/react/client/floating.ts` (`useFloating`, `useTopLayer`); the pure positioning and keyboard logic they use is in `src/core/position.ts` and `src/core/keyboard.ts` and is tested without React.

## Adding a component: checklist

1. **Recipe.** `src/core/recipes/<name>.ts`: `cva` with base classes, variants, `defaultVariants`; export `<name>Variants`, `<Name>StyleProps`, `<name>Class()`. Add `export * from "./recipes/<name>";` to `src/core/index.ts`.
2. **React.** Server-safe: `src/react/ui/<name>/<name>.tsx` and `index.ts`; add `export * from "./<name>";` to `src/react/ui/index.ts`. Stateful: `src/react/client/<name>.tsx`, exported from `src/react/client/index.ts`.
3. **Vue.** `src/vue/<name>.ts`; export from `src/vue/index.ts`. Vue models use `modelValue` + `update:modelValue`.
4. **Expo.** Add to `src/expo/components.tsx` and export from `src/expo/index.ts`. If the component is not ready for native, say so in the task list rather than silently skipping.
5. **Tokens.** Reuse existing tokens. If a new one is required, add it to `tokens.css` and every file in `styles/themes/`, then run `npm run tokens` and `npm run audit`.
6. **Tests.** Co-locate `<name>.test.tsx` next to the React component. Cover: default render, each variant/size maps to expected classes or attributes, `data-tone`/`action` override, each state (disabled, loading, invalid where relevant), keyboard interaction, `className` merge, and ref forwarding.
7. **Verify.** In `packages/bokoui`: `npm test`, `npm run typecheck`, `npm run build`. Then publish locally, bump the example's `bokoui` version, and check it under all 8 styles in light and dark.
8. **Docs.** Tick the task in `docs/tasks/tasks-ui-framework.md`. When the playground exists, add the component to it.

## Known inconsistencies to fix as they are touched

- `Input` uses its own `InputVariant` while Button uses `Variant`. Acceptable (different visual concepts), but keep the names distinct.
- `Icon` is exported for React and Vue but has no Expo equivalent yet.
