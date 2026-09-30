# Task List: UI Framework (Tailwind CSS + Next.js)

Based on: [SRS](../srs/srs-ui-framework.md)
Legend: `[ ]` todo, `[x]` done. Requirement IDs refer to the SRS.

## Phase 0: Preparation
- [x] T0.1 Read the Next.js 16 docs in `node_modules/next/dist/docs/` for breaking changes (App Router, `"use client"`, layout/head handling)
- [x] T0.2 Resolve open questions in SRS section 9 (distribution model, Radix/Base UI, icon set)
  - Decided for now: source-owned copy-paste model; build from scratch (Radix/Base UI only when a component needs it, e.g. Modal/Select); icon set deferred to T4.11 (inline SVG until then); style and mode are independent axes
- [x] T0.3 Enable TypeScript `strict` and confirm `tsc --noEmit` + `eslint` pass on the baseline
- [x] T0.4 Add dependencies: `class-variance-authority`, `clsx`, `tailwind-merge` (icon library deferred to T4.11)

## Phase 1: Foundation (FR-2.3, FR-4.1, NFR-1, NFR-7)
- [x] T1.1 Create folder structure: `src/components/ui`, `src/components/theme`, `src/lib`, `src/styles/themes`
- [x] T1.2 Add `cn()` helper in `src/lib/cn.ts` (clsx + tailwind-merge)
- [x] T1.3 Define token schema (color, radius, border, shadow, spacing, font, motion) in `src/styles/tokens.css`
- [x] T1.4 Map tokens to Tailwind v4 `@theme` in `globals.css`
- [x] T1.5 Define shared variant types (`Color`, `Size`, `Action`, `Variant`) in `src/components/ui/types.ts`
- [x] T1.6 Set up path alias and import conventions (`@/components/ui/...`)

## Phase 2: Theming engine (FR-4.x)
- [x] T2.1 Implement `data-theme` (style) and `data-mode` (light/dark) attributes on `<html>`
- [x] T2.2 Build `ThemeProvider` and `useTheme` hook (state, setStyle, setMode)
- [x] T2.3 Persist choice (localStorage/cookie) and detect system preference
- [x] T2.4 Add pre-hydration script/cookie read to prevent flash of wrong theme (FR-4.5)
- [x] T2.5 Build `ThemeSwitcher` UI (style picker + light/dark toggle)
- [x] T2.6 Support user-defined custom themes via token object (FR-4.7)
- [x] T2.7 Respect `prefers-reduced-motion` for theme transitions

## Phase 3: Core design styles (FR-3.1)
Each style: token file in `src/styles/themes/`, registered in the theme registry, checked in light and dark.
- [x] T3.1 Flat
- [x] T3.2 Material (Google)
- [x] T3.3 Swiss / International Typographic
- [x] T3.4 Brutalism
- [x] T3.5 Neo-Brutalism
- [x] T3.6 Monochrome
- [x] T3.7 Dark / OLED-first
- [x] T3.8 Fluent (Microsoft)
- [x] T3.9 Contrast audit for every style/mode pair (NFR-2) (`node scripts/audit-contrast.mjs`)

## Phase 4: Primitive components (FR-1.x, FR-2.x)
Each component: typed variants (color, variant, action, size), states (hover/focus/active/disabled/loading/error), forwardRef, `className` merge, a11y, `"use client"` only when needed.
- [x] T4.1 Button (reference implementation, establishes the pattern)
- [x] T4.2 Input
- [ ] T4.3 Textarea
- [ ] T4.4 Label and form field wrapper (label, hint, error)
- [ ] T4.5 Image (wrapper over `next/image`)
- [ ] T4.6 Select
- [ ] T4.7 Checkbox, Radio, Switch
- [ ] T4.8 Badge, Avatar, Divider
- [ ] T4.9 Card
- [ ] T4.10 Typography (Heading, Text, Link)
- [ ] T4.11 Icon
- [ ] T4.12 Alert, Spinner, Tooltip
- [ ] T4.13 Modal / Dialog, Tabs
- [ ] T4.14 Barrel exports and per-component index

## Phase 5: Playground and docs (FR-5.x)
- [x] T5.1 Root layout wired with ThemeProvider and ThemeSwitcher
- [ ] T5.2 `/playground` route listing every component with all variants
- [ ] T5.3 Per-component page with prop table and code sample
- [ ] T5.4 Replace default Create Next App landing page
- [ ] T5.5 README: setup, usage, adding a new style, adding a component

## Phase 6: Quality (NFR-2, NFR-8, NFR-9)
- [ ] T6.1 Set up test runner (Vitest + Testing Library)
- [ ] T6.2 Unit tests for variants and states of each component
- [ ] T6.3 Accessibility tests (axe) and keyboard navigation checks
- [ ] T6.4 Optional visual regression (Playwright screenshots per style)
- [ ] T6.5 CI: lint, typecheck, test, build
- [ ] T6.6 Verify graceful degradation of backdrop-filter and similar effects across browsers

## Phase 7: Extended styles (FR-3.2, best-effort)
- [ ] T7.1 Bento Grid (layout utilities + Card variants)
- [ ] T7.2 Skeuomorphism
- [ ] T7.3 Claymorphism
- [ ] T7.4 Liquid Glass (Apple, 2025)
- [ ] T7.5 Maximalism
- [ ] T7.6 Memphis
- [ ] T7.7 Y2K / Retro-futurism
- [ ] T7.8 Cyberpunk / Neon
- [ ] T7.9 Aurora / Mesh Gradient
- [ ] T7.10 Spatial UI (visionOS)
- [ ] T7.11 Kinetic Typography / Motion-first
- [ ] T7.12 Organic / Biomorphic

## Phase 8: Composite components (FR-1.5, future)
- [ ] T8.1 Sidebar
- [ ] T8.2 Menu / Dropdown menu
- [ ] T8.3 Navbar
- [ ] T8.4 Breadcrumb, Pagination, Table
- [ ] T8.5 Form and layout patterns (see `docs/plan-layouts.md`)

## Phase 9: Open-source and portability (FR-6.x, future)
- [ ] T9.1 Extract tokens/themes into a framework-agnostic package (CSS variables + JSON)
- [ ] T9.2 Restructure into a monorepo (`tokens`, `react`, `docs`)
- [ ] T9.3 Choose license, add LICENSE, CONTRIBUTING, CHANGELOG
- [ ] T9.4 Publish to npm and/or provide a CLI for copy-paste installation
- [ ] T9.5 Prototype Vue adapter using shared tokens
- [ ] T9.6 Prototype mobile layer (Expo/NativeWind, Ionic)

## Milestones
| Milestone | Phases | Outcome |
|---|---|---|
| M1 MVP | 0 to 2, Button from 4.1, T5.1 | Themed Button with working switcher |
| M2 Core library | 3, 4, 5 | 8 core styles, all primitives, playground |
| M3 Hardened | 6 | Tests, a11y, CI |
| M4 Extended | 7, 8 | Extra styles and composites |
| M5 Open source | 9 | Package, docs, multi-framework prototypes |
