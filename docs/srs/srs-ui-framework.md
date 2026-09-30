# Software Requirements Specification: UI Framework (Tailwind CSS + Next.js)

Source: [docs/plan-tailwindcss.md](../plan-tailwindcss.md)
Version: 0.1 (draft) | Date: 2026-09-30

## 1. Introduction

### 1.1 Purpose
Define the requirements for a reusable, themeable UI component framework, similar in spirit to shadcn/ui, built on Next.js, React and Tailwind CSS.

### 1.2 Scope
A library of primitive components (Button, Input, Textarea, Image, etc.) living in the `components` folder and imported into pages as needed. Each component takes props to produce variants (color, theme, action, size, ...). The framework supports many visual design styles and runtime theme switching. Later it will host composite components (Sidebar, Menu, ...) and be open-sourced for use in other projects.

### 1.3 Definitions
| Term | Meaning |
|---|---|
| Primitive | A single-element component (Button, Input) |
| Composite | A component built from primitives (Sidebar, Menu) |
| Variant | A visual/behavioral option of a component (color, size, action) |
| Design style | A whole visual language (e.g. Material, Brutalism, Claymorphism) |
| Theme | A concrete set of design tokens selected at runtime |
| Token | A named design value (color, radius, shadow, spacing, font) |

### 1.4 Technology baseline
- Next.js 16.3.7 (App Router, `src/app`), React 19.2.8
- Tailwind CSS v4 (`@tailwindcss/postcss`), TypeScript 5
- ESLint 9
- Note: this Next.js version has breaking changes; consult `node_modules/next/dist/docs/` before implementation.

## 2. Overall Description

### 2.1 Product perspective
Standalone framework inside a Next.js project. Components are source-owned (copyable, editable) rather than an opaque package, following the shadcn/ui model. Architecture should keep the styling/token layer independent of React so it can later be reused elsewhere.

### 2.2 Users
- **Primary:** the project owner, building own pages/apps.
- **Future:** open-source consumers and other internal projects.

### 2.3 Constraints
- Tailwind CSS is the styling engine.
- TypeScript is required throughout.
- Must work with Next.js Server and Client Components.

### 2.4 Assumptions
- Design styles beyond the core set are best-effort.
- Multi-framework and mobile support are future goals and must not block the web/React MVP.

## 3. Functional Requirements

Priority: **M** = Must, **S** = Should, **C** = Could.

### 3.1 Component library
| ID | Requirement | Pri |
|---|---|---|
| FR-1.1 | Provide primitive components in a `components` folder: Button, Input, Textarea, Image, and further standard elements (Select, Checkbox, Radio, Switch, Label, Badge, Card, Avatar, Link, Heading/Text, Icon, Divider, Modal, Tooltip, Tabs, Alert, Spinner, etc.) | M |
| FR-1.2 | Each component is importable individually into any page | M |
| FR-1.3 | Components forward refs and accept standard HTML attributes and `className` for overrides | M |
| FR-1.4 | Components are composable so composites (Sidebar, Menu, ...) can be built from them | M |
| FR-1.5 | Composite components (Sidebar, Menu, Navbar, Tabs, Modal, ...) are supported by the architecture; built in a later phase | S |

### 3.2 Variants
| ID | Requirement | Pri |
|---|---|---|
| FR-2.1 | Variants are declared through typed props: `color`, `variant`/`theme`, `action` (e.g. primary, danger, success), `size` | M |
| FR-2.2 | Default variants apply when no props are passed | M |
| FR-2.3 | Arbitrary extra Tailwind classes can be passed and merged without conflicts (class-merge utility) | M |
| FR-2.4 | Component states are supported: hover, focus, active, disabled, loading, error | M |
| FR-2.5 | Variant definitions are centralized (e.g. a `cva`-style definition per component) and not scattered in JSX | S |

### 3.3 Design styles
| ID | Requirement | Pri |
|---|---|---|
| FR-3.1 | Core styles supported: Flat, Material (Google), Swiss/International Typographic, Brutalism, Neo-Brutalism, Monochrome, Dark/OLED-first, Fluent (Microsoft) | M |
| FR-3.2 | Extended styles supported: Bento Grid, Skeuomorphism, Claymorphism, Liquid Glass (Apple, 2025), Maximalism, Memphis, Y2K/Retro-futurism, Cyberpunk/Neon, Aurora/Mesh Gradient, Spatial UI (visionOS), Kinetic Typography/Motion-first, Organic/Biomorphic | C |
| FR-3.3 | A style is expressed as a set of tokens and style overrides, not as forked components | M |
| FR-3.4 | Adding a new style requires no change to component code | S |

### 3.4 Theming
| ID | Requirement | Pri |
|---|---|---|
| FR-4.1 | Design tokens (color, radius, border, shadow, spacing, typography, motion) are defined as CSS variables mapped into Tailwind v4 `@theme` | M |
| FR-4.2 | Users switch style/theme at runtime via a UI control (e.g. `ThemeSwitcher`) | M |
| FR-4.3 | Light/dark mode switching, with system preference detection | M |
| FR-4.4 | Selected theme persists across reloads (localStorage/cookie) | M |
| FR-4.5 | No flash of wrong theme on first paint (SSR-safe, pre-hydration script or cookie) | M |
| FR-4.6 | Provide a `ThemeProvider` and `useTheme` hook | M |
| FR-4.7 | Users can define custom themes by supplying token values | S |
| FR-4.8 | Theme switch may animate (respecting reduced motion) | C |

### 3.5 Showcase / documentation
| ID | Requirement | Pri |
|---|---|---|
| FR-5.1 | A playground/demo route displays every component with all variants under the selected style | M |
| FR-5.2 | Demo page includes the theme switcher | M |
| FR-5.3 | Per-component usage docs with prop tables and code samples | S |

## 4. Non-Functional Requirements

| ID | Category | Requirement | Pri |
|---|---|---|---|
| NFR-1 | Typing | TypeScript `strict` mode; all props, variants and theme names fully typed with autocomplete; no `any` in public API | M |
| NFR-2 | Accessibility | WCAG 2.1 AA: keyboard navigation, visible focus, ARIA roles/labels, contrast checked per theme, `prefers-reduced-motion` respected | M |
| NFR-3 | Performance | Zero runtime CSS-in-JS; only used Tailwind classes shipped; theme switch without page reload; minimal client JS | M |
| NFR-4 | SSR | Components render correctly with Next.js SSR/RSC; client-only components marked `"use client"` | M |
| NFR-5 | Responsiveness | Mobile-first, responsive at all Tailwind breakpoints | M |
| NFR-6 | Consistency | Uniform prop naming and API across components | M |
| NFR-7 | Maintainability | Consistent folder structure, naming, ESLint clean | M |
| NFR-8 | Testing | Unit tests for components/variants; a11y checks; optional visual regression | S |
| NFR-9 | Browser support | Latest 2 versions of Chrome, Edge, Firefox, Safari. Effects like backdrop-filter degrade gracefully | M |
| NFR-10 | Licensing | Code and dependencies compatible with open-sourcing (e.g. MIT) | S |
| NFR-11 | Documentation | Public API documented; README with setup and usage | S |

## 5. Portability and Future Requirements

| ID | Requirement | Pri |
|---|---|---|
| FR-6.1 | Design tokens and style definitions are kept framework-agnostic (plain CSS variables / JSON) so they can be reused outside React | S |
| FR-6.2 | Structure allows extraction into a standalone package (monorepo-ready) for open-source release, reusable by other projects | S |
| FR-6.3 | Vue.js support through a separate adapter package sharing tokens and styles | C |
| FR-6.4 | Support for other frameworks (Svelte, Angular, etc.) | C |
| FR-6.5 | Mobile support (Expo/React Native, Ionic) via shared tokens and a platform-specific component layer (e.g. NativeWind) | C |

## 6. Proposed Architecture (informative)

```
src/
  app/                    # Next.js routes, playground
  components/
    ui/                   # primitives: button, input, textarea, image ...
    composite/            # sidebar, menu ... (future)
    theme/                # ThemeProvider, ThemeSwitcher, useTheme
  lib/
    cn.ts                 # clsx + tailwind-merge
  styles/
    tokens.css            # base tokens + @theme mapping
    themes/               # one file per design style (flat.css, brutalism.css ...)
```
- Variants via `class-variance-authority`, class merging via `clsx` + `tailwind-merge`.
- Style selected by a `data-theme` (style) and `data-mode` (light/dark) attribute on `<html>`; each style overrides token variables.
- Accessible behavior primitives may use Radix UI or Base UI where useful.

## 7. Acceptance Criteria
1. A page can import `Button` and render 4+ colors, 3+ sizes and multiple actions purely via props.
2. Clicking the theme switcher changes the whole app between at least 8 core styles and light/dark without reload, and persists after refresh with no flash.
3. `tsc --noEmit` and `eslint` pass with strict settings; invalid variant values fail type checking.
4. Playground page shows all components across all styles.
5. Adding a new style requires only a new theme file plus registration.

## 8. Out of Scope (initial release)
Vue/other-framework and mobile implementations, npm publishing, and the composite components (only their architectural support is in scope).

## 9. Open Questions
- Should the primary distribution model be shadcn-style copy-paste (CLI) or an installable npm package?
- Use Radix/Base UI for behavior primitives, or build from scratch?
- Which icon set to standardize on?
- Are styles composable (e.g. Neo-Brutalism + Dark), or mutually exclusive with a separate light/dark axis? (Assumed: style and mode are independent axes.)
