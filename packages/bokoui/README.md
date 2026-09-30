# bokoui

Themeable React components for Tailwind CSS v4. Eight design styles (Flat, Material, Swiss, Brutalism, Neo-Brutalism, Monochrome, Dark/OLED, Fluent), each in light and dark, switchable at runtime.

Components: `Button`, `Input` (more coming).

## Install

```bash
npm i bokoui
```

Requires `react` 19, `tailwindcss` 4.

## Setup (Next.js App Router)

**1. `app/globals.css`**: import the stylesheet after Tailwind (it also registers the package for class scanning):

```css
@import "tailwindcss";
@import "bokoui/styles.css";
```

**2. `app/layout.tsx`**: add the pre-hydration script and the provider:

```tsx
import { ThemeProvider, ThemeSwitcher } from "bokoui/theme";
import { ThemeScript } from "bokoui/theme-script";

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
import { Button, Input } from "bokoui";

<Button color="primary" variant="outline" size="lg">Save</Button>
<Button action="danger" loading>Deleting</Button>
<Input placeholder="Email" invalid />
```

## Responsive

`size` on `Button` and `Input`, and `fullWidth` on `Button`, accept a mobile-first per-breakpoint map (`base`, `sm`, `md`, `lg`, `xl`, `2xl`) using Tailwind's breakpoints:

```tsx
<Button size={{ base: "sm", md: "lg" }} fullWidth={{ base: true, md: false }}>Save</Button>
<Input size={{ base: "md", lg: "lg" }} />
```

On touch devices (`pointer: coarse`) controls have a 44px minimum height. Any Tailwind responsive class also works through `className`. Requires Tailwind 4.1+.

## Theming

```tsx
import { useTheme } from "bokoui/theme";

const { style, mode, setStyle, setMode } = useTheme(); // mode: "light" | "dark" | "system"
```

Custom themes: pass `customThemes` to both `<ThemeScript>` and `<ThemeProvider>` (same object). See `CustomTheme` in `bokoui/theme`.

## Entry points

| Import | Contents | Runs on |
|---|---|---|
| `bokoui` | components, variant types, `cn` | server or client |
| `bokoui/theme` | `ThemeProvider`, `useTheme`, `ThemeSwitcher`, theme registry | client |
| `bokoui/theme-script` | `ThemeScript` | server |
| `bokoui/styles.css` | tokens, themes, Tailwind mapping | build time |

## Development

Run from this directory after `npm install`:

| Script | Does |
|---|---|
| `npm run build` | Build with tsup into `dist/`, then inline CSS and mark `theme.js` as a client module |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run audit` | Contrast audit for every style/mode pair (run after changing theme tokens) |
| `npm run publish:local` | Build and publish to local Verdaccio (`.npmrc`); bump the version first with `npm version patch` |

Source layout: `src/components/ui` (primitives), `src/components/theme` (provider, switcher, registry), `src/styles` (`tokens.css` and one file per style in `themes/`), `src/lib/cn.ts`. A new style is a new file in `src/styles/themes/`, imported from `themes/index.css` and registered in `themes.ts`.

## License

MIT
