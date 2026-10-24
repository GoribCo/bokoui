# next-js-shadcn-ui

The same application shell as [`../next-js-layouts`](../next-js-layouts), built with **shadcn/ui** (Radix, new-york style) instead of `bokoui/react`, so the two can be compared side by side. Features, routes, mock data, services, stores, i18n messages and tests of the shell are the same; only the UI layer differs. Nothing was styled to imitate the bokoui version: components are used as shadcn ships them, with the default neutral theme.

Run it like the other example:

```bash
npm install
npm run dev     # http://localhost:3000
```

Sign in with any email and password.

## Feature parity

| Feature | Here |
|---|---|
| Header with branding, toggle, title, breadcrumbs, search, notifications, display settings | Same slots; sticky bar across the top |
| Sidebar: workspace switcher, grouped nested menu, common links, account area | shadcn `Sidebar` (icon rail, mobile sheet, `Ctrl+B`) |
| Workspace switcher | `Popover` + `Command`, search above 6 entries, "Manage workspaces" link |
| Account menu | `DropdownMenu` with header card, settings, profile, sign out |
| Display settings (theme, font size, language) | `Popover` with `ToggleGroup` and language buttons |
| Notifications with All / Unread / Urgent / Invitations tabs | `Popover` + `Tabs` |
| Mobile: bottom navigation, sub-menu sheet, sidebar sheet | `Sheet` |
| Landing page, legal pages, public organization profiles, sign-in, form and table examples | Same pages |
| Roles, organizations, services, Zustand, nuqs, React Hook Form + Zod, next-intl | Unchanged |

## Not carried over

- **Design styles and the custom theme.** bokoui has 8 styles; shadcn has one palette. Here there is light, dark and system (`next-themes`, `.dark` class).
- **Font family switcher** (it was off by default in the other example).
- **Maximum frame width.** The shell fills the window; the shadcn `Sidebar` is fixed to the viewport edge.
- **Tooltip on a truncated label** is a native `title` here.

## What differs in the code

| Topic | bokoui example | This example |
|---|---|---|
| Components | `bokoui/react` imports | Owned code in `src/components/ui/` (added with `npx shadcn@latest add`) |
| Layout and type helpers (`Heading`, `Text`, `Grid`, `Inline`, `Container`) | Library components | `src/components/layout/primitives.tsx`, plain Tailwind (shadcn ships none) |
| Forms | `FormField` | `Field`, `FieldLabel`, `FieldError` |
| Theme | `ThemeProvider` and `ThemeScript` | `next-themes` |
| Sidebar state | Own sidebar, store drives collapse and drawer | shadcn `SidebarProvider` controlled by the same store (collapse); mobile sheet state is the provider's |
| Menu tree | Own list markup | `SidebarMenu`, `SidebarMenuSub`, `Collapsible` |

## Notes from building it

- The CLI wrote `import { cn } from "cn"` into every component; it had to be changed to `@/lib/utils`.
- Two stock pieces failed lint (`react-hooks`): `use-mobile.ts` (rewritten with `useSyncExternalStore`) and `SidebarMenuSkeleton` (rule disabled for `components/ui`).
- axe found two issues in stock shadcn output: the avatar fallback text has a contrast ratio of 4.3:1 (`text-muted-foreground` on `bg-muted`), and the table's scroll container is not keyboard focusable. Both are fixed in this copy.
- Everything else in the shell passes axe on all routes at 1280 and 390 px, in light and dark.

See the [bokoui example's README](../next-js-layouts/README.md) for the shell's structure, services and how to replace the mock data.
