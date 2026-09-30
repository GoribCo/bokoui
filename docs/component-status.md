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
| Select | yes | yes | no | yes | custom listbox; Expo would need a native picker design |
| Checkbox, Radio, RadioGroup, Switch | yes | untested | untested | yes | no `indeterminate` prop (set the DOM property via ref) |
| Badge | yes | untested | untested | yes | |
| Avatar | yes | untested | untested | yes | stateless: pass `imgProps.onError` to hide a broken image |
| Divider | yes | untested | untested | yes | |
| Card, CardHeader, CardFooter | yes | untested | untested | yes | |
| Image | yes | untested | untested | yes | framework-neutral; `as` takes `next/image` / `NuxtImg` |
| Icon | yes | untested | no | yes | no SVG runtime on Expo |
| Alert | yes | untested | untested | yes | |
| Spinner | yes | untested | untested | yes | |
| Tabs | yes | yes | no | yes | Expo: not planned |
| Modal | yes | yes | untested | yes | Expo uses React Native `Modal` |
| Tooltip | yes | yes | no | yes | no hover on touch |
| Menu | yes | yes | no | yes | Expo: needs a native action-sheet design |
| Breadcrumb | yes | todo | no | yes | web-only pattern; `as` takes a router link |
| Pagination | yes | todo | todo | yes | |
| Table | yes | todo | no | yes | web-only pattern |
| Sidebar | yes | todo | no | yes | server-safe (CSS-only collapsed state, no context); wrap items in `Tooltip` when collapsed |
| Navbar | yes | todo | no | yes | client entry (mobile menu state) |
| Progress | yes | todo | todo | yes | server-safe; indeterminate uses `animate-bokoui-indeterminate` (keyframes in `bokoui.css`) |
| Skeleton, SkeletonText | yes | todo | todo | yes | decorative (`aria-hidden`); mark the region `aria-busy` |
| Accordion | yes | todo | no | yes | client entry; height animates via grid rows; closed panels are `inert` |
| Popover | yes | todo | no | yes | client entry; non-modal, focus moves in |
| Drawer | yes | todo | todo | yes | a `Modal` with `placement`; Expo `Modal` could take a `side` prop |
| Toast (`ToastProvider`, `useToast`) | yes | todo | todo | yes | needs a provider; Vue would use provide/inject, Expo an overlay view |
| Slider | yes | todo | todo | yes | native range input; arrow/Home/End verified in Chrome (jsdom cannot) |
| Combobox | yes | todo | no | yes | editable combobox with list autocomplete |
| Calendar, DatePicker | yes | todo | no | yes | date logic is framework-neutral in `core/calendar.ts`; locale via Intl |
| Rating | yes | todo | todo | yes | radio group; read-only variant is an image |
| FileUpload | yes | todo | no | yes | real file input inside a drop zone; validates type, size, count |
| Tag | yes | todo | todo | yes | handlers need a client component |
| Stepper | yes | todo | todo | yes | presentational |
| EmptyState | yes | todo | todo | yes | |
| CommandPalette | yes | todo | no | yes | built on Modal; Cmd/Ctrl+K hotkey option |
| Stack, Inline, Grid, Container | yes | todo | todo | yes | layout primitives, see `plan-layouts.md` |
| Heading, Text, Link | yes | untested | untested | yes | |

## Demo apps

| Demo | Platform | Port | Pages |
| --- | --- | --- | --- |
| `examples/expo-js` | Expo (web build) | 3000 | `/` (Button, Input, typography) |
| `examples/next-js` | React / Next.js | 3001 | `/`, `/playground`, `/forms`, `/display`, `/table`, `/feedback`, `/overlays`, `/tabs`, `/accordion`, `/patterns`, `/navigation` |
| `examples/nuxt-js` | Vue / Nuxt | 3002 | `/`, `/forms`, `/display`, `/feedback`, `/overlays`, `/tabs` |
| `examples/next-js-layouts` | React (copy of the original demo) | 3003 | `/`; not part of the switcher |

The home page (`/`, "Button, Input & Typography") is the same content in all three demos and is deliberately left as it was first written (Expo omits "Responsive props", which is web-only). Each demo's header has a React / Vue / Expo switcher (see the root README); it keeps the current page where the target has it. The per-platform page lists live in each switcher and must be updated when a page is added.

## What is left

### Ports (Vue / Expo)
- [ ] Nuxt pages missing compared with Next: `/playground`, `/table`, `/accordion`, `/patterns`, `/navigation` (need the Vue ports first)
- [ ] Expo demo has a single screen; more screens once more components exist for it
- [ ] Vue: Breadcrumb, Pagination, Table, Sidebar, Navbar, Progress, Skeleton, Accordion, Popover, Drawer, Toast, Slider, Combobox, Calendar, DatePicker, Rating, FileUpload, Tag, Stepper, EmptyState, CommandPalette, layout primitives
- [ ] Expo: Pagination, Progress, Skeleton, Drawer (Modal `side` prop), Toast, Slider, Rating, Tag, Stepper, EmptyState, layout primitives
- [ ] Vue and Expo: write tests for everything marked **untested** (Vue Test Utils is installed; Expo needs a test setup)
- [ ] Nuxt demo pages (and a Nuxt sidebar built from the new Sidebar/Navbar) for Breadcrumb, Pagination, Table, Sidebar, Navbar (after the Vue ports)

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

- Tailwind classes built with template strings produce no CSS: `src/core/recipes/literal-classes.test.ts`.
- `tailwind-merge` ignoring custom theme keys (`rounded-card` did not lose to `rounded-none`): `src/core/cn.test.ts`.
- A `display` on a `<dialog>` base class made closed dialogs visible: `modal.test.tsx`.
- `:read-only` matching buttons: `select.test.tsx`.
- Vue components touching `window` during server rendering: `src/vue/ssr.test.ts`.
- Stale `.next` cache in the demo: `run.sh` now clears it.
