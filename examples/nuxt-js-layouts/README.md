# bokoui Nuxt layouts example

The generic application shell of [the Next.js layouts example](../next-js-layouts), on `bokoui/vue` and Nuxt 4. It has every page of that example: landing, sign-in, dashboard, organizations, notifications, profile, account, admin (role-restricted, 403), privacy settings, the department tree, the sample screens (`/examples/*`, `/consultations/sample`), public organization profiles (`/hospital|pharmacy|company/<slug>`), help, contact, terms and privacy. The shell has a collapsible sidebar with a recursive menu tree, mobile drawer and bottom tabs, organization switching, role-filtered menus, header search (Ctrl/Cmd+K), a notifications panel, an `en`/`bn` switch and the theme switcher. All data is mock data behind `app/services/index.ts`.

## Run

```bash
npm install
npm run dev     # http://localhost:3006 (any email and password sign in)
```

`bokoui` comes from the registry in `.npmrc` (local Verdaccio). From the repo root, `./run.sh` publishes the library and runs every example.

## Structure

- `app/data/`: mock menus (one per organization, one with ~700 nested items), organizations, footer links.
- `app/services/index.ts`: the single place to swap mocks for an API.
- `app/utils/`: `access.ts` (role/permission filtering), `active.ts` (current page and its parents), `icons.ts`.
- `app/composables/`: `useShell` (organization, menu), `useT` (cookie-based language).
- `app/middleware/access.global.ts`: 403 for pages hidden from your roles.
- `app/layouts/`: `default` (dashboard shell) and `public`.

## Differences from the Next.js example

- Sign-in is a cookie set in the browser (any email and password); there is no API route, JWT, TanStack Query or zod (forms validate by hand).
- The `empty@` and `many@` stress users, the font and text-size settings and the server-side remote search are not ported; header search filters the menu and a sample people list.
- `/consultations/sample` is a condensed version (rows can be added and removed; no suggestion lists or per-field editing).
- Not covered by tests; checked by building the app and requesting every route.

Full versions of this shell: [next-js-layouts](../next-js-layouts) (React) and [expo-js-layouts](../expo-js-layouts) (Expo).
