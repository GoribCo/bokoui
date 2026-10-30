# Component status

Where each component stands per platform, and what is left. Update this file whenever a component is added or a gap is closed. The task list (`docs/tasks/tasks-ui-framework.md`) tracks work items; this file tracks **parity and verification**.

Legend: **yes** = implemented and unit-tested. **untested** = implemented, compiles, no tests. **no** = deliberately not planned (reason in Notes). **todo** = planned, not started. "Browser" means checked by hand in a real browser in the Next.js demo (`examples/next-js`) under at least one style.

Working order: build **React first**, show it in `examples/next-js`, then port to Vue (`examples/nuxt-js`) and Expo in a separate pass.

## Components

| Component | React | Vue | Expo | Browser (Next) | Notes |
| --- | --- | --- | --- | --- | --- |
| Button | yes | untested | untested | yes | reference implementation |
| Input | yes | untested | untested | yes | |
| Textarea | yes | untested | untested | yes | |
| Label, FormField | yes | untested | untested | yes | Vue uses a scoped slot (`controlProps`) |
| Select | yes | yes | untested | yes | custom listbox; Expo: listbox in an anchored layer |
| Checkbox, Radio, RadioGroup, Switch | yes | untested | untested | yes | no `indeterminate` prop (set the DOM property via ref) |
| Badge | yes | untested | untested | yes | |
| Avatar | yes | untested | untested | yes | stateless: pass `imgProps.onError` to hide a broken image |
| Divider | yes | untested | untested | yes | |
| Card, CardHeader, CardFooter | yes | untested | untested | yes | |
| Image | yes | untested | untested | yes | framework-neutral; `as` takes `next/image` / `NuxtImg` |
| Icon | yes | untested | no | yes | no SVG runtime on Expo |
| Alert | yes | untested | untested | yes | |
| Spinner | yes | untested | untested | yes | |
| Tabs | yes | yes | untested | yes | Expo: compound parts, panel mounted only while selected |
| Modal | yes | yes | untested | yes | Expo uses React Native `Modal` |
| Tooltip | yes | yes | untested | yes | no hover on touch; Expo: long press, also set as accessibility hint |
| Menu | yes | yes | untested | yes | Expo: anchored layer in a transparent native `Modal` |
| Breadcrumb | yes | untested | untested | yes | web-only pattern; `as` takes a router link; Expo: `onPress` instead of `as` |
| Pagination | yes | untested | untested | yes | |
| Table | yes | untested | untested | yes | web-only pattern; Expo: fixed column width, scrolls sideways |
| Sidebar | yes | untested | untested | yes | server-safe (CSS-only collapsed state, no context); wrap items in `Tooltip` when collapsed; Expo: `collapsed` makes an icon rail |
| Navbar | yes | untested | untested | yes | client entry (mobile menu state); Expo: links collapse under 768px |
| FloatingNav, FloatingNavItem | yes | untested | yes (web build) | no | floating pill bottom bar of icon buttons, current item filled; React: server-safe, `as` takes a router link or `button`, `fixed` pins it above the safe area; Expo: `bottomInset`, `icon` may be a function of the color; used by `examples/expo-js-layouts` |
| Progress | yes | untested | untested | yes | server-safe; indeterminate uses `animate-bokoui-indeterminate` (keyframes in `bokoui.css`) |
| Skeleton, SkeletonText | yes | untested | untested | yes | decorative (`aria-hidden`); mark the region `aria-busy` |
| Accordion | yes | untested | untested | yes | client entry; height animates via grid rows; closed panels are `inert`; Expo: no height animation |
| Popover | yes | untested | untested | yes | client entry; non-modal, focus moves in; Expo: anchored layer |
| Drawer | yes | untested | untested | yes | a `Modal` with `placement`; Expo `Drawer` takes `side` |
| Toast (`ToastProvider`, `useToast`) | yes | untested | untested | yes | needs a provider; Vue uses provide/inject, Expo an overlay view |
| Slider | yes | untested | untested | yes | native range input; arrow/Home/End verified in Chrome (jsdom cannot) |
| Combobox | yes | untested | untested | yes | editable combobox with list autocomplete; Expo: list drawn inline (a Modal would steal keyboard focus) |
| Calendar, DatePicker | yes | untested | untested | yes | date logic is framework-neutral in `core/calendar.ts`; locale via Intl; Expo: DatePicker opens the Calendar in a `Modal` |
| Rating | yes | untested | untested | yes | radio group; read-only variant is an image |
| FileUpload | yes | untested | no | yes | real file input inside a drop zone; validates type, size, count |
| Tag | yes | untested | untested | yes | handlers need a client component |
| Stepper | yes | untested | untested | yes | presentational |
| EmptyState | yes | untested | untested | yes | |
| CommandPalette | yes | untested | no | yes | built on Modal; Cmd/Ctrl+K hotkey option |
| Stack, Inline, Grid, Container | yes | untested | untested | yes | layout primitives, see `plan-layouts.md` |
| Heading, Text, Link | yes | untested | untested | yes | |

## Demo apps

| Demo | Platform | Port | Pages |
| --- | --- | --- | --- |
| `examples/expo-js` | Expo (web build) | 3000 | `/`, `/forms`, `/display`, `/feedback`, `/overlays`, `/navigation` |
| `examples/next-js` | React / Next.js | 3001 | `/`, `/playground`, `/forms`, `/display`, `/table`, `/feedback`, `/overlays`, `/tabs`, `/accordion`, `/patterns`, `/navigation` |
| `examples/nuxt-js` | Vue / Nuxt | 3002 | `/`, `/setup`, `/forms`, `/display`, `/feedback`, `/data`, `/navigation`, `/pickers`, `/overlays`, `/tabs` |
| `examples/nuxt-js-layouts` | Vue / Nuxt, application shell (reduced port of next-js-layouts: no sign-in/API, query, forms, search) | 3005 | `/dashboard`, `/organizations`, `/profile`, `/examples/table`, `/help`, `/contact`, `/legal/*`, other menu links open a placeholder; not part of the switcher |
| `examples/expo-js-layouts` | Expo (web build), application shell, port of next-js-layouts | 3004 | `/`, `/sign-in`, `/dashboard`, `/examples/*`, `/admin`, public profiles `/[type]/[slug]`; not part of the switcher |
| `examples/next-js-layouts` | React, application shell (see below) | 3003 | `/`, `/examples/*`, `/admin`, `/sign-in`, public profiles `/hospital/[slug]`, `/pharmacy/[slug]`, `/company/[slug]`; not part of the switcher |

The home page (`/`, "Button, Input & Typography") is the same content in all three demos and is deliberately left as it was first written (Expo omits "Responsive props", which is web-only). Each demo's header has a React / Vue / Expo switcher (see the root README); it keeps the current page where the target has it. The per-platform page lists live in each switcher and must be updated when a page is added.

## Application shell (`examples/next-js-layouts`)

Generic layout for large products, built on `bokoui/react`; specs in [SRS](srs/srs-layouts.md), work items in [tasks-layouts.md](tasks/tasks-layouts.md). Implemented in full (Phases 0 to 8); `npm run lint` and `npm run typecheck` pass. **Not yet run in a browser**: no `next build`, no unit tests, no accessibility sweep. Those are deferred until the owner has tested it by hand.

| Part | Status | Notes |
| --- | --- | --- |
| Sidebar (org switcher, scrolling menu, common menu, account), collapsible rail | built, untested | collapsed state in a cookie, read on the server |
| Menu tree (unbounded depth, role filtering, active trail, truncation tooltips) | built, untested | mock menu of about 700 items, five levels |
| Header (branding, breadcrumbs, search, notifications, appearance) | built, untested | appearance inline from `lg`, popover below |
| Mobile: bottom nav, sub-menu sheet, "More", drawer | built, untested | slot count in `config/navigation.ts` |
| Footer | built, untested | links from `config/site.ts` |
| Theme mode, design style, language (en, bn), optional font picker | built, untested | font picker off by default |
| State: Zustand, TanStack Query, nuqs, React Hook Form + Zod | built, untested | per SRS section 3.9 |
| Routing: `(auth)`, `(dashboard)`, `(public)`, proxy, 403 via `forbidden()` | built, untested | `forbidden()` needs `experimental.authInterrupts` |
| SEO: `buildMetadata`, `robots`, `sitemap`, noindex for signed-in areas | built, untested | |
| Public organization profiles | built, untested | cached with `unstable_cache` |

Left for this example: unit tests (menu filtering, access helpers, stores), browser and accessibility checks at mobile, tablet and desktop widths in all 8 styles and both modes, the SRS section 6 acceptance walk-through, right-to-left support (FR-13.3, optional).

## What is left

### Ports (Vue / Expo)
- [ ] Nuxt pages missing compared with Next: `/playground`, `/patterns` (the other Next pages are covered by `/data`, `/navigation`, `/pickers`, `/feedback`, `/overlays`)
- [x] Vue: all React components are ported (see the table). Only `test/vue/blocks.test.ts` (server render of each, plus Accordion, Calendar, Combobox, Pagination, Toast) covers them; the browser checks are not done.
- [ ] Vue and Expo: write tests for everything marked **untested** (Vue Test Utils is installed; Expo needs a test setup)

### Verification
- [x] Automated: every page x 8 styles x 2 modes with axe-core in Chrome (structure, ARIA and real color contrast): 0 violations (160 runs)
- [ ] Human eyes on every page in all styles: only Flat dark, Neo-brutalism light, Material light and Swiss dark were looked at, and not every page in each
- [ ] The custom "Sunset" theme in the demo is not covered by the sweep
- [ ] Screen-reader pass (VoiceOver/NVDA). Keyboard behavior is unit-tested and was checked in Chrome; axe cannot judge announcements
- [ ] Run the Expo demo on a device or simulator; nothing in `src/expo` has been run
- [ ] Toast: check in Safari/Firefox that the top-layer viewport shows above an open `<dialog>` (Chrome verified only)
- [ ] Safari and Firefox pass (T6.6). Only Chrome is available here. Features to check, with the expected degradation:
  - Popover API (`popover="manual"`, `showPopover`): without it tooltips, menus and selects render as `position: fixed` without top layer; they should still position correctly.
  - `<dialog>` + `::backdrop` (Modal, Drawer): supported everywhere; check backdrop blur is simply absent, not broken.
  - `backdrop-filter` (sticky header, Navbar `sticky`, Modal backdrop): should fall back to the translucent background.
  - `inert` (Accordion): Safari 15.5+, Firefox 112+.
  - `:has()` (FileUpload focus ring): Safari 15.4+, Firefox 121+.
  - `color-mix()` (all tone tokens): Chrome 111+, Safari 16.2+, Firefox 113+.
  - Native range input styling (Slider) and `accent-color`.
- [ ] Visual regression screenshots per style (T6.4, optional): not built

### Missing components (not yet started)
- [ ] Date range picker and time picker, dual-thumb range slider, multi-select (Combobox with tags), tree view, carousel, data-table extras (row selection, column resize, virtualization), breadcrumb overflow, Toast actions/promise API
- [ ] Layout and form patterns from `docs/plan-layouts.md` (T8.5)

### Project
- [ ] Playground / per-component docs pages with prop tables (T5.2, T5.3)
- [ ] CI: lint, typecheck, test, build (T6.5)
- [ ] CHANGELOG, CONTRIBUTING (T9.3); public npm publish (T9.4)
- [ ] Extended styles (Phase 7)

## Lessons that became tests

Bugs only a real browser (or a Node environment) showed, and the guard that now covers each:

- Tailwind classes built with template strings produce no CSS: `test/core/recipes/literal-classes.test.ts`.
- `tailwind-merge` ignoring custom theme keys (`rounded-card` did not lose to `rounded-none`): `test/core/cn.test.ts`.
- A `display` on a `<dialog>` base class made closed dialogs visible: `test/react/blocks/modal.test.tsx`.
- `:read-only` matching buttons: `test/react/ui/select.test.tsx`.
- Vue components touching `window` during server rendering: `test/vue/ssr.test.ts`.
- Stale `.next` cache in the demo: `run.sh` now clears it.

## Expo application shell (`examples/expo-js-layouts`): gaps found in `bokoui/expo`

Verified on the Expo web build (390, 768 and 1280 px, all 8 styles in both modes, English and Bangla, axe); not run on a device or simulator. Gaps worked around in the app, not fixed in the library:

- **`Drawer` / `Modal` body does not flex.** The card sizes to its content, so a scrolling list inside needs an explicit height (`useSheetHeight`, `MobileDrawer`). A `flex: 1` body would remove that.
- **`Drawer` cannot sit above a bottom bar**, and a side drawer starts under the status bar (no safe-area padding), so the app draws its own title row. A bottom sheet therefore covers the bottom navigation instead of opening above it.
- **No font family.** Components never set `fontFamily`, so Noto Sans Bengali is loaded (`lib/fonts`) but only applies to text the app styles itself; Bengali otherwise falls back to the platform font.
- **`ThemeProvider` has no "ready" flag.** It reads its saved style and mode after mounting; the app pre-reads the same AsyncStorage keys (`lib/theme-defaults.ts`) so the first frame is right.
- **axe findings that come from the library:** `Select` (`role="combobox"` without `aria-controls`) and `Table` (`role="grid"` without row structure) on the web build.
- `Link` has no `external` prop; there is no Icon on Expo (the app uses `lucide-react-native`).

## Material design styles (React, Expo; Vue picks up the CSS)

The package ships 12 styles on top of the 8 classic ones: Minimalism, Bento, Material 3, Soft UI, Neumorphism, Claymorphism, Skeuomorphism, Terminal, Synthwave, Glassmorphism, Liquid Glass, Aurora (each in light and dark, 20 styles in all, registered in `core/themes.ts`).

- **Source of truth:** `packages/bokoui/src/expo/styles/*.ts` (colors through the web token names plus surface *effects*). `scripts/sync-expo-styles.mjs` generates `src/styles/themes/<id>.css` from them, so the web paints the same colors and materials. Edit the TypeScript, run the script, rebuild.
- **Web tokens (all optional):** `card-*`, `control-*`, `pressed-*`, `field-*`, `solid-*`, `page-image`, `page-bg` (see `styles/tokens.css`). The `surface-card`, `surface-card-raised`, `surface-overlay` and `surface-field` utilities paint them with the plain surface as the fallback, so the classic styles are unchanged. Recipes that use them: Card, Button (solid, outline, soft), Input and the controls built on it, Modal/Drawer (opaque), Sidebar, Navbar, FloatingNav. `body` paints `page-image`.
- **Expo:** the same materials as CSS-like strings (`effects.ts`): `boxShadow` (outer and `inset`), gradients, blur. `Surface` and `Backdrop` are exported from `bokoui/expo/ui`. Blur on a device needs the optional peer `expo-blur`.
- **Checks:** `npm run audit` passes for all 20 styles (colors were adjusted until it did; Neumorphism and Claymorphism keep a visible 1px border on fields and outline buttons instead of shadows alone). axe on the Expo web build and the layouts sweep (`check:browser`, 400 style/mode/width/route checks) found no problems. Translucent glass cannot be judged by axe; text colors are chosen for the page behind.
- **Not done / unverified:** Vue components were not touched or checked (they share the recipes, so they gain the look where they use them). Inset shadows, radial gradients and `expo-blur` were checked on the web build only, not on a device. Typography: only Expo draws `fontFamily` for Terminal; on the web `--bokoui-font` carries it. The gallery tiles show the active style's three colors, not each style's own.
