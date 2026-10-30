# bokoui

Themeable UI components for Tailwind CSS v4 with eight design styles (Flat, Material, Swiss, Brutalism, Neo-Brutalism, Monochrome, Dark/OLED, Fluent), each in light and dark, switchable at runtime. One package, one entry point per platform.

**about 50 components** for React, growing across Vue and Expo: forms (Input, Textarea, Select, Combobox, DatePicker, Checkbox, Radio, Switch, Slider, Rating, FileUpload), display (Badge, Avatar, Tag, Card, Table, Stepper, EmptyState), feedback (Alert, Toast, Progress, Skeleton, Spinner), overlays (Modal, Drawer, Popover, Tooltip, Menu, CommandPalette), navigation (Navbar, Sidebar, Tabs, Breadcrumb, Pagination, Accordion) and layout primitives (Stack, Inline, Grid, Container). See [Components](#components) for the list and per-platform status.

## Which entry point

| Platform | Import | Notes |
|---|---|---|
| React / Next.js | `bokoui/react` | everything: basic elements, composed blocks, the shared types and class helpers (`buttonClass`, ...). `bokoui/react/ui` has the basic elements only, `bokoui/react/blocks` the composed ones; `bokoui/react/theme` (client provider, switcher) and `bokoui/react/theme-script` (server). `bokoui/react/client` is the old stateful-only entry, kept for compatibility |
| Vue / Nuxt | `bokoui/vue` | same components as Vue 3 components, plus `ThemeProvider`, `ThemeSwitcher`, `useTheme`, `buildThemeScript` |
| React Native / Expo | `bokoui/expo` | native components + `ThemeProvider`; no CSS or Tailwind needed |
| Any (framework-neutral) | `bokoui/core` | internal building block (recipes, theme engine); apps should not need it, `bokoui/react` and `bokoui/expo` re-export what they need |
| Web build | `bokoui/styles.css` | tokens, all 36 themes, Tailwind mapping (React and Vue); ~10 KB gzipped. `bokoui/styles-lite.css` has the 8 classic themes only (~6 KB gzipped): use it only if the app offers just those styles |
| Any | `bokoui/tokens.json` | every style x mode as plain token values |
| Docs tooling | `bokoui/props.json` | every React component's own props (name, type, default, description), generated from the types |

React, Vue and React Native are optional peer dependencies: install only the one you use. Web (React, Vue) also needs Tailwind CSS 4.1+.

The web components share the same class recipes and CSS, so a `<Button color="primary">` looks identical in React and Vue. The Expo components read the same tokens (generated from the theme CSS) and paint them with `StyleSheet` values.

## Install

```bash
npm i bokoui
```

## Setup: Next.js (React)

**1. `app/globals.css`**: import the stylesheet after Tailwind (it also registers the package for class scanning):

```css
@import "tailwindcss";
@import "bokoui/styles.css";
```

**2. `app/layout.tsx`**: add the pre-hydration script and the provider:

```tsx
import { ThemeProvider, ThemeSwitcher } from "bokoui/react/theme";
import { ThemeScript } from "bokoui/react/theme-script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="flat" data-mode="light" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <ThemeSwitcher />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**3. Use components:**

```tsx
import { Button, Input } from "bokoui/react";

<Button color="primary" variant="outline" size="lg">Save</Button>
<Button action="danger" loading>Deleting</Button>
<Input placeholder="Email" invalid />
```

## Setup: Nuxt (Vue)

Needs `tailwindcss` and `@tailwindcss/vite`.

**1. `nuxt.config.ts`**

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
})
```

**2. `app/assets/css/main.css`**

```css
@import "tailwindcss";
@import "bokoui/styles.css";
```

**3. `app/app.vue`**: set the saved theme before first paint and provide the theme:

```vue
<script setup lang="ts">
import { ThemeProvider, ThemeSwitcher, buildThemeScript } from 'bokoui/vue'

useHead({ script: [{ innerHTML: buildThemeScript(), tagPosition: 'head', tagPriority: 'critical' }] })
</script>

<template>
  <ThemeProvider>
    <ThemeSwitcher />
    <NuxtPage />
  </ThemeProvider>
</template>
```

Do not set `data-theme` / `data-mode` through `useHead`; the script owns them.

**4. Use components:**

```vue
<script setup lang="ts">
import { Button, Input } from 'bokoui/vue'
const email = ref('')
</script>

<template>
  <Button color="primary" variant="outline" size="lg">Save</Button>
  <Button action="danger" loading>Deleting</Button>
  <Input v-model="email" placeholder="Email" invalid />
  <Button><template #leftIcon><MyIcon /></template>With icon</Button>
</template>
```

Slots: `Button` has `leftIcon` / `rightIcon`, `Input` has `startAdornment` / `endAdornment`. Vue components use `full-width` / `icon-only` in templates.

## Setup: React Native / Expo

```bash
npx expo install bokoui @react-native-async-storage/async-storage expo-blur
```

Needs Expo SDK 54+. No CSS or Tailwind step. Wrap the app once (with Expo Router, in `app/_layout.tsx`), then use components below it:

```tsx
import { ThemeProvider, Button, Input, Heading, Text, Link, useTheme } from "bokoui/expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  return (
    <ThemeProvider defaultStyle="material" storage={AsyncStorage}>
      <Heading as="h1">Hello</Heading>
      <Text muted>Same style names and colors as the web.</Text>
      <Button color="primary" onPress={() => {}}>Save</Button>
      <Input placeholder="Email" />
    </ThemeProvider>
  );
}
```

`storage` is optional (any AsyncStorage-compatible object); without it the choice lasts for the session. `useTheme()` returns `{ style, mode, resolvedMode, tokens, setStyle, setMode }`, where `tokens` are the resolved numbers and colors for the active style, for your own components.

Native limits: components are theme-aware but not pixel-identical to the web (no CSS `color-mix`, box shadows or hover states; pressed state is used instead). Fonts are not applied; pass `style={{ fontFamily }}` or load fonts with `expo-font`. Responsive props are web-only. Verified by bundling for web and iOS and by running the web build in a browser (see `examples/expo-js`; its README has the full install and usage guide); not yet run on a device or simulator. Application-shell examples: `examples/next-js-layouts`, `examples/nuxt-js-layouts`, `examples/expo-js-layouts`.

## Components

React is the reference platform; Vue and Expo follow. The full, current matrix (with tests and browser-verification status, and what is left to do) is in [docs/component-status.md](../../docs/component-status.md).

| Group | Components | Import from |
|---|---|---|
| Basics | Button, Input, Heading, Text, Link, Icon | `bokoui/react` |
| Forms | FormField, Label, Textarea, Checkbox, Radio, RadioGroup, Switch, Slider | `bokoui/react` |
| | Select, Rating | `bokoui/react/ui` |
| | Combobox, DatePicker, Calendar, FileUpload | `bokoui/react/blocks` |
| Data display | Badge, Avatar, Tag, Card, Divider, Image, Table, Stepper, EmptyState, Skeleton, Progress | `bokoui/react` |
| Feedback | Alert, Spinner | `bokoui/react` |
| | ToastProvider + `useToast` | `bokoui/react/ui` |
| Overlays | Tooltip | `bokoui/react/ui` |
| | Modal, Drawer, Popover, Menu, CommandPalette | `bokoui/react/blocks` |
| Navigation | Breadcrumb, Pagination, Sidebar | `bokoui/react` |
| | Navbar, Tabs, Accordion, FloatingNav | `bokoui/react/blocks` |
| Layout | Stack, Inline, Grid, Container | `bokoui/react` |

### Server and client components

Import from `bokoui/react`, `bokoui/react/ui` or `bokoui/react/blocks` in server and client files alike. Each stateful component (Tabs, Modal, Select, ...) starts with its own `"use client"` line, so Next.js treats only those as client components and the stateless ones (Button, Card, Table, Sidebar, ...) stay Server Components. Components that take event handlers (`Tag onRemove`, `Pagination onPageChange`, `Button onClick`) must be rendered from a Client Component when you pass a function.

### Forms

`FormField` gives any control an id, a linked label, a hint, and an error that is announced and marks the control invalid:

```tsx
import { FormField, Input } from "bokoui/react";
import { Select } from "bokoui/react";

<FormField label="Email" hint="We never share it" error={errors.email} required>
  <Input type="email" />
</FormField>
<FormField label="Country"><Select options={countries} /></FormField>
```

In Vue the field uses a scoped slot: `<FormField label="Email" v-slot="{ controlProps }"><Input v-bind="controlProps" /></FormField>`.

### Overlays

`Modal` and `Drawer` use the native `<dialog>` (focus trap, Escape, inert background from the browser). `Tooltip`, `Popover`, `Menu` and `Select` use the Popover API in the top layer and position themselves with a small flip-and-clamp routine. No headless-UI dependency is used.

### Accessibility

Targets WCAG 2.1 AA. Every style/mode pair is contrast-checked (`npm run audit`, including tinted "soft" backgrounds). Components are keyboard-operable with visible focus, use native elements where they exist, respect `prefers-reduced-motion`, and keep touch targets at 44px on coarse pointers. The test suite runs axe-core over every React component, including open overlays, and a browser sweep covers real color contrast across all styles and modes.

### API tables

`bokoui/props.json` lists each React component's own props. The demo site renders its API tables from it:

```ts
import props from "bokoui/props.json";
props.Modal.props; // [{ name, type, required, description, default }, ...]
```

## Responsive

Mobile-first, using Tailwind's breakpoints (`sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem).

**Responsive props.** `size` on `Button` and `Input`, and `fullWidth` on `Button`, accept a per-breakpoint map with the keys `base`, `sm`, `md`, `lg`, `xl`, `2xl`. Each key applies from that breakpoint up:

```tsx
<Button size={{ base: "sm", md: "lg" }} fullWidth={{ base: true, md: false }}>Save</Button>
<Input size={{ base: "md", lg: "lg" }} />
```

Plain values still work (`size="lg"`). The types are exported as `Responsive<T>` and `Breakpoint`.

**Any other property.** Use Tailwind's responsive variants through `className`; it is merged with `cn`, so it overrides the defaults:

```tsx
<Button className="w-full md:w-auto">Save</Button>
```

**Touch targets.** On touch devices (`pointer: coarse`) buttons and inputs have a 44px minimum height, and icon-only buttons a 44px minimum width.

Requires Tailwind 4.1+ (for the `pointer-coarse` variant).

## Typography

```tsx
import { Heading, Text, Link } from "bokoui/react";

<Heading as="h1">Title</Heading>                 {/* size defaults from the element */}
<Heading as="h2" size="lg">Compact heading</Heading>  {/* sm md lg xl 2xl 3xl 4xl */}
<Text variant="lead" muted>Intro paragraph</Text>     {/* body lead small caption code */}
<Link href="/docs">Docs</Link>
<Link href="https://example.com" external>Site</Link>
```

Large heading sizes scale with the viewport (`3xl` is `text-3xl` on mobile, `text-4xl` from `md`). For a router link, apply `linkClass()` from `bokoui/core` to its `className`.

Each style sets its own type tokens: `--bokoui-font`, `--bokoui-font-heading`, `--bokoui-font-mono`, `--bokoui-heading-weight`, `--bokoui-heading-tracking`, `--bokoui-heading-transform` and `--bokoui-text-leading`. They are also Tailwind utilities (`font-ui`, `font-heading`, `font-mono`) and can be overridden per custom theme.

### Fonts

bokoui does **not** ship or load font files; it only references font families. Load the ones you need and expose them as CSS variables on `<html>`. Without them, each style falls back to a system font.

| Style | Family | Needs loading? |
|---|---|---|
| Flat, Monochrome, OLED, Neo-Brutalism | Geist via `--font-geist-sans` (mono: `--font-geist-mono`) | Optional, falls back to system UI font |
| Material | Roboto via `--font-roboto` | Optional, falls back to system UI font |
| Swiss | Helvetica Neue / Arial | No (system) |
| Fluent | Segoe UI Variable | No (system on Windows, falls back elsewhere) |
| Brutalism | System monospace | No |

With Next.js:

```tsx
import { Geist, Geist_Mono, Roboto } from "next/font/google";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"], weight: ["400", "500", "700"] });

<html className={`${geist.variable} ${geistMono.variable} ${roboto.variable}`}>
```

Any other loader works too (Fontsource, `@font-face`): just define the same variable names. To use a different font in a style, override `font` in a custom theme (`tokens: { font: "Inter, sans-serif" }`).

## Theming

```tsx
import { useTheme } from "bokoui/react/theme";

const { style, mode, setStyle, setMode } = useTheme(); // mode: "light" | "dark" | "system"
```

Custom themes: pass `customThemes` to both the script (`<ThemeScript>` / `buildThemeScript()`) and `<ThemeProvider>` (same object; Expo needs only the provider). See `CustomTheme` in `bokoui/core`.


## Development

Run from this directory after `npm install`:

| Script | Does |
|---|---|
| `npm run build` | Generate tokens, build every entry with tsup into `dist/`, inline the CSS, put `"use client"` on the stateful React entries, write the `react`, `react/ui`, `react/blocks` barrels, check the client boundaries, write `dist/tokens.json` and `dist/props.json` |
| `npm test` | Vitest, all in `test/` (`test/core`, `test/react`, `test/vue`, `test/a11y`, `test/structure`): unit tests, axe accessibility tests, Vue server-rendering tests, structure checks (`npm run test:watch` while developing) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run audit` | Contrast audit for every style/mode pair, including tinted backgrounds (run after changing theme tokens) |
| `npm run tokens` | Regenerate `src/expo/tokens.generated.ts` from the theme CSS |
| `npm run publish:local` | Build and publish to local Verdaccio (`.npmrc`); bump the version first with `npm version patch` |

Source layout: `src/core` (framework-neutral: class recipes, theme engine, types), `src/react`, `src/vue`, `src/expo` (thin bindings), `src/styles` (`tokens.css` and one file per style in `themes/`). `src/expo/tokens.generated.ts` is generated from the theme CSS by `npm run tokens` (also run by `build`).

A new style is a new file in `src/styles/themes/`, imported from `themes/index.css` and registered in `src/core/themes.ts`. A new component is a class recipe in `src/core/recipes/` plus one thin binding per platform; the rules and checklist are in [docs/component-conventions.md](../../docs/component-conventions.md).

## License

MIT
