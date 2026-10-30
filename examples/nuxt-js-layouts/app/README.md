# bokoui Nuxt layouts example

The generic application shell of [the Next.js layouts example](../next-js-layouts), on `bokoui/vue` and Nuxt 4: header, collapsible sidebar with a recursive menu tree, mobile drawer and bottom tabs, organization switching, role-filtered menus with a 403 for hidden pages, `en`/`bn` language switch, theme switcher, public layout, error page. All data is mock data behind `app/services/index.ts`.

## Run

```bash
npm install
npm run dev     # http://localhost:3005
```

`bokoui` comes from the registry in `.npmrc` (local Verdaccio). From the repo root, `./run.sh` publishes the library and runs every example.

## Structure

- `app/data/`: mock menus (one per organization, one with ~700 nested items), organizations, footer links.
- `app/services/index.ts`: the single place to swap mocks for an API.
- `app/utils/`: `access.ts` (role/permission filtering), `active.ts` (current page and its parents), `icons.ts`.
- `app/composables/`: `useShell` (organization, menu), `useT` (cookie-based language).
- `app/middleware/access.global.ts`: 403 for pages hidden from your roles.
- `app/layouts/`: `default` (dashboard shell) and `public`.

## Not ported from the Next.js example

Sign-in and JWT cookies, the API route, TanStack Query, forms with zod, notifications, search and the style-showcase screens. Menu entries without a screen open a placeholder page.
