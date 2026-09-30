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
