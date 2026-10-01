# next-js-layouts

A generic application shell built with Next.js 16 (App Router) and `bokoui/react`: left sidebar with organization switcher and role-aware menus, header, footer, mobile bottom navigation and drawer, appearance controls (mode, style, language), SEO helpers and public organization profiles. All data is sample data served by a small API in `src/api` and read through services and TanStack Query hooks, so the shell can be copied into another project and wired to a real API.

Specs: [SRS](../../docs/srs/srs-layouts.md) and [task list](../../docs/tasks/tasks-layouts.md).

## Run

```bash
npm install
npm run dev     # http://localhost:3000 (run.sh at the repo root uses 3003)
```

`bokoui` comes from the local Verdaccio registry in `.npmrc` (`http://127.0.0.1:4873/`). Publish the library first if the version in `package.json` is not available (`npm run publish:local`). Open the app and sign in with any email and password.

## Scripts

| Script | Does |
|---|---|
| `npm run dev` / `build` / `start` | Dev server, production build, production server |
| `npm run lint` / `typecheck` | ESLint, `tsc --noEmit` |
| `npm run build:pkg` / `publish:local` | Build / publish the library in `../../packages/bokoui` |

## How it fits together

```
src/
  proxy.ts                optimistic redirect to sign-in; layouts do the real checks
  api/                    the sample backend: data/ (TypeScript data), endpoints/ (handlers), router.ts
  app/
    layout.tsx            root: html lang, fonts, ThemeScript, AppProviders
    api/v1/[...path]/     HTTP entry of src/api (the app calls it like any server)
    (auth)/               sign-in (no shell)
    (dashboard)/          pages inside the shell; layout.tsx checks the session and builds the shell
    (public)/             pages anyone can open: landing, organization profiles, legal, help
  components/             layout/ navigation/ organization/ account/ appearance/ (presentational, typed props)
  hooks/                  TanStack Query hooks (use-notifications, use-records, ...) and UI hooks
  providers/              context providers (session, stores, query client)
  styles/                 typography tokens and custom themes
  lib/                    all non-React TypeScript
    api/                  ApiClient (browser) and getServerApi (server), ApiError
    services/             <Name>Service classes: typed, validated calls to the API
    schemas/ types/       Zod schemas and types
    query/                BaseQuery (hook base class), query key factory, URL search-param parsers
    stores/               Zustand stores and cookie persistence
    config/ i18n/ access/ menu/ auth/ organization/ session/ seo/ content/ fonts/
```

Data flows one way: **component, then hook, then service, then `apiClient`, then the API**. Components never call `fetch` or a service; they call a hook (`useNotifications`, `useRecords`, `useOrganizations`, ...).

- **Services** (`src/lib/services/*.service.ts`) are classes that extend `BaseService`, take an `ApiClient` (the browser one by default) and validate every answer with a Zod schema. Server code passes the server client: `new MenuService(await getServerApi())`.
- **Hooks** (`src/hooks/use-*.ts`) each define a class that extends `BaseQuery` and calls `this.useQuery`, `this.useMutation` or `this.useQueryClient`, then export a plain hook that calls it. `BaseQuery` (`src/lib/query/base-query.ts`) is the only place hooks get TanStack Query from; ESLint rejects a direct import in a hook.

The API is served by this app at `/api/v1/*` from `src/api` and returns `{ success, results, meta }` (errors: `{ success: false, message, code }`). Endpoints: `GET /session`, `/organizations`, `/organizations/:id/menu`, `/menu/common`, `/profiles/me`, `/public/organizations[/:type/:slug]`, `/notifications`, `/records`; `POST /notifications/read`, `/staff`.

State has one owner each: server data in TanStack Query, interface state in Zustand (the collapsed sidebar and the active organization are also written to cookies so the server renders them correctly on first paint), shareable view state in the URL (nuqs), forms in React Hook Form with Zod.

## Replace the sample backend with a real API

1. Set `NEXT_PUBLIC_API_BASE_URL` to the real server (for example `https://api.example.com/v1`). Until then the app calls its own `/api/v1`.
2. If the real answers differ from the sample ones, change only the schemas in `src/lib/schemas/` and the bodies of the `src/lib/services/*.service.ts` functions. Hooks and components stay as they are.
3. Delete `src/api/` and `src/app/api/` once nothing needs the sample data.
4. Replace the mock session cookie: `SESSION_COOKIE` in `src/lib/config/auth.ts`, the `signIn` and `signOut` actions in `src/lib/auth/actions.ts`, the sign-in page, and the cookie check in `src/api/auth.ts` (which disappears with `src/api`).
5. Replace `src/lib/config/site.ts` and `account-menu.ts` with your values, or load them from the API.

## Common changes

**Add a page.** Create `src/app/(dashboard)/my-page/page.tsx`, export `metadata = buildMetadata({ title, description, path })` and render `PageContainer` and `PageHeader`. No shell change is needed. Public pages go under `(public)`; add their URL prefix to `PUBLIC_PATH_PREFIXES` in `src/lib/config/auth.ts`.

**Add a menu item.** Menus are data: add an entry to the organization's menu (`src/api/data/menus.ts`, or your API) with `id`, `label`, optional `labelKey`, `icon`, `href`, `children`, `badge` and `requiredRoles`. Ids must be unique within a menu. Icons are names in the registry `src/components/navigation/menu-icons.ts`; add a Lucide icon there to use it.

**Restrict a page by role.** Check on the server, as `(dashboard)/admin/page.tsx` does: `can(await getActiveRoles(), "admin.access")`, then call `forbidden()`. Add permissions to `src/lib/access/policy.ts`. Hiding the menu item is not protection.

**Add an organization type.** Add an entry to `src/lib/config/organization-types.ts`, a member to `OrganizationDetails` in `src/lib/types/organization.ts` with its profile section in `components/organization/public-profile.tsx`, and a folder `src/app/(public)/{segment}/[slug]/page.tsx` (copy an existing one). Add `organizationType.{key}` to the message catalogs.

**Add a language.** Add the code to `locales` in `src/lib/i18n/config.ts`, a catalog `src/lib/i18n/messages/{code}.json` (same keys as `en.json`), one loader in `src/lib/i18n/messages.ts`, and `locale.{code}` to every catalog. For a script that needs its own font, register it in `src/lib/fonts/fonts.ts` and map it in `src/styles/typography.css`.

**Change fonts or the type scale.** Fonts: `src/lib/fonts/fonts.ts` (families) and `src/styles/typography.css` (mapping and scale tokens). The optional header font picker is off by default; set `features.fontSwitcher` in `src/lib/config/features.ts`.

**Change the bottom navigation.** `bottomNavSlots` in `src/lib/config/navigation.ts` sets how many slots the bar has, counting "More".

## Notes

- Public organization profiles are fetched on demand and cached for an hour with `unstable_cache` (`src/lib/organization/public-organization.ts`). The app does not use Cache Components, because the root layout reads cookies (locale, sidebar state).
- `forbidden()` needs `experimental.authInterrupts` in `next.config.ts`; it is experimental in this Next.js version.
- Jotai and Redux Toolkit are deliberately not installed (SRS FR-9.6).
