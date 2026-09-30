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
| Heading, Text, Link | yes | untested | untested | yes | |

## What is left

### Ports (Vue / Expo)
- [ ] Vue: Breadcrumb, Pagination, Table, Sidebar, Navbar
- [ ] Expo: Pagination
- [ ] Vue and Expo: write tests for everything marked **untested** (Vue Test Utils is installed; Expo needs a test setup)
- [ ] Nuxt demo pages (and a Nuxt sidebar built from the new Sidebar/Navbar) for Breadcrumb, Pagination, Table, Sidebar, Navbar (after the Vue ports)

### Verification
- [ ] Look at every page in all 8 styles x light/dark (only Flat dark, Neo-brutalism light, Material light and Swiss dark have been screenshotted, and not every page in each). Navigation and Table pages: Flat dark only
- [ ] Keyboard and screen-reader pass; automated axe checks (T6.3)
- [ ] Run the Expo demo on a device or simulator; nothing in `src/expo` has been run
- [ ] Verify `backdrop-filter`, Popover API and `<dialog>` fallbacks in Safari and Firefox (T6.6)

### Missing components (not yet started)
- [ ] Popover (generic), Accordion / Collapsible, Progress, Skeleton, Toast, Drawer / Sheet, Combobox with search, DatePicker, Slider, Breadcrumb overflow, Command palette
- [ ] Layout and form patterns from `docs/plan-layouts.md` (T8.5)

### Project
- [ ] Playground / per-component docs pages with prop tables (T5.2, T5.3)
- [ ] CI: lint, typecheck, test, build (T6.5)
- [ ] CHANGELOG, CONTRIBUTING (T9.3); public npm publish (T9.4)
- [ ] Extended styles (Phase 7)
