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
| `npm run lint` / `typecheck` | ESLint, `next typegen` + `tsc --noEmit` |
| `npm test` | Unit tests with `node:test` (`src/**/*.test.ts`) |
| `npm run check` | Lint, typecheck, unit tests and a production build |
| `npm run check:browser` | Builds a clone of the app, serves it and drives Chrome (puppeteer-core + axe): every route at 390, 768 and 1280 px in all styles and modes, the interactive parts, focus and touch targets. Needs Chrome (`CHROME_PATH` to override). Options: `--only sweep,interactions,controls`, `--widths`, `--styles`, `--modes`, `--routes`, `--locale bn`, `--url` |
| `npm run build:pkg` / `publish:local` | Build / publish the library in `../../packages/bokoui` |

## Start here (copying this app into a real project)

Do these in order. Each step names the file.

1. **Install `bokoui`** (see "The `bokoui` dependency" below), then `npm install`.
2. **Remove the demo:** `npm run remove-demo` deletes the `/examples` pages, the sample records and staff endpoints, and replaces the landing page and dashboard with empty ones. Run `npm run check` afterwards. Search for `demo` to see every place it touched.
3. **Branding:** `src/lib/config/site.ts` (name, legal name, description, URL, contact addresses, logo, first-visit style and mode), `src/lib/config/features.ts` (flags), `src/lib/i18n/config.ts` (languages). Nothing else should spell out the product name or an address.
4. **Data:** point `NEXT_PUBLIC_API_BASE_URL` at your API, adjust `src/lib/schemas/` and the `src/lib/services/*.service.ts` bodies, then delete `src/api/` and `src/app/api/` (see "Replace the sample backend").
5. **Auth:** your API issues the httpOnly token cookies (see "Authentication"); check `src/lib/config/auth.ts` (cookie names), `src/proxy.ts` and `src/app/(auth)/sign-in/`.
6. **Menus and roles:** menus come from your API (`/organizations/:id/menu`, `/menu/common`); roles and permissions in `src/lib/authorization/` (`role-templates.ts`, `permissions.ts`); the account menu in `src/lib/config/account-menu.ts`.
7. **Legal text:** `src/lib/content/legal.ts` (template text, not reviewed by a lawyer).
8. **Stub pages:** replace the pages listed under "Replace before launch".
9. **Languages:** edit the catalogs in `src/lib/i18n/messages/`; add a language as described under "Common changes".

## Replace before launch

These pages are placeholders or sample content:

| Route | File | State |
|---|---|---|
| `/account` | `src/app/(dashboard)/account/page.tsx` | stub |
| `/settings/privacy` | `src/app/(dashboard)/settings/privacy/page.tsx` | stub |
| `/help` | `src/app/(public)/help/page.tsx` | stub |
| `/contact` | `src/app/(public)/contact/page.tsx` | stub |
| `/legal/terms`, `/legal/privacy` | `src/lib/content/legal.ts` | template text |
| `/` | `src/app/(public)/page.tsx` | demo landing page (removed by `remove-demo`) |
| `/dashboard` | `src/app/(dashboard)/dashboard/page.tsx` | placeholder numbers |
| `/organizations`, `/notifications` | `src/app/(dashboard)/` | work against the sample API; real once your API provides them |

## The `bokoui` dependency

- The app uses the published `bokoui` package, version `^0.2.33` (`package.json`). It is not copied into `src`.
- This repository installs it from the local Verdaccio registry set in `.npmrc` (`http://127.0.0.1:4873/`). Outside this repository, delete that `.npmrc` line (or point it at your registry) and install `bokoui` from wherever it is published: the public npm registry, or a private registry you publish it to with `npm run publish:local`'s equivalent (`npm publish` in `packages/bokoui`).
- Peer dependencies are listed in the package's `package.json`; this app uses React 19 and Tailwind CSS 4. `src/app/globals.css` imports `bokoui/styles.css`.
- To update: publish the new version, change the version in `package.json`, run `npm install`, then `npm run check`. Check the library changelog or the diff of `packages/bokoui` for breaking changes first.

## Folder structure and naming

- `src/app/` holds only routes and their layouts; pages stay thin and render a component. Route groups: `(auth)`, `(dashboard)`, `(public)`.
- `src/components/<area>/` presentational components with typed props, in kebab-case files (`account-menu.tsx`); a component never fetches data.
- `src/hooks/use-<resource>.ts`: data hooks (`use<Resource>` to read, `use<Verb><Resource>` to change), built on `BaseQuery`.
- `src/lib/services/<resource>.service.ts`: one `<Resource>Service` class per resource, one instance each in `lib/services/index.ts`.
- `src/lib/schemas/<resource>.ts`: Zod schemas; types are inferred from them or live in `src/lib/types/`.
- `src/lib/query/keys.ts`: every query key; nowhere else.
- `src/lib/config/`: settings that change per product. `src/lib/stores/`: Zustand stores. `src/providers/`: React providers.
- Tests sit next to the code as `*.test.ts` (`node:test`).
- Do not import `@/lib/services`, `@/lib/api` or call `fetch` from a component.

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
    api/                  ApiClient (browser and server), ApiError
    services/             <Name>Service classes: typed, validated calls to the API
    schemas/ types/       Zod schemas and types
    query/                BaseQuery (hook base class), query key factory, URL search-param parsers
    stores/               Zustand stores and cookie persistence
    config/ i18n/ access/ menu/ auth/ organization/ session/ seo/ content/ fonts/
```

Data flows one way: **component, then hook, then service, then `apiClient`, then the API**. Components never call `fetch` or a service; they call a hook (`useNotifications`, `useRecords`, `useOrganizations`, ...).

- **Services** (`src/lib/services/*.service.ts`) are classes that extend `BaseService` and validate every answer with a Zod schema. `src/lib/services/index.ts` exports one instance of each (`menuService`, `notificationService`, ...); hooks, Server Components and layouts import those and never write `new XService()`. The same instance works in the browser and on the server: `ApiClient` adds the absolute URL and the visitor's cookies when it runs on the server, and a call with `cache` options (public profiles) uses the Next.js data cache and sends no cookies.
- **Hooks** (`src/hooks/use-*.ts`) each define a class that extends `BaseQuery` and calls `this.useQuery`, `this.useMutation` or `this.useQueryClient`, then export a plain hook that calls it. `BaseQuery` (`src/lib/query/base-query.ts`) is the only place hooks get TanStack Query from; ESLint rejects a direct import in a hook.

The API is served by this app at `/api/v1/*` from `src/api` and returns `{ success, results, meta }` (errors: `{ success: false, message, code }`). Endpoints: `GET /session`, `/organizations`, `/organizations/:id/menu`, `/menu/common`, `/profiles/me`, `/public/organizations[/:type/:slug]`, `/notifications`, `/records`; `POST /auth/login`, `/auth/refresh`, `/auth/logout`, `/notifications/read`, `/staff`. Every endpoint is described once in `src/lib/contract/index.ts` (method, path, request and response schemas, error codes, paging `meta`); the sample backend's route table and the services both read it.

State has one owner each: server data in TanStack Query, interface state in Zustand (the collapsed sidebar and the active organization are also written to cookies so the server renders them correctly on first paint), shareable view state in the URL (nuqs), forms in React Hook Form with Zod.

## Authentication

The session is a pair of JWTs in **httpOnly cookies**: a short-lived access token (`access_token`, 15 minutes) and a refresh token (`refresh_token`, 7 days). JavaScript never sees them; the browser, Server Components and the proxy all send them.

| Piece | File | Job |
|---|---|---|
| API | `POST /auth/login`, `/auth/refresh`, `/auth/logout` (contract: `src/lib/contract`) | Issue, rotate and clear the cookies. Real provider plugs in here (or behind it) |
| Proxy | `src/proxy.ts` | No usable token: redirect to sign-in with `?next=`. Expired access token with a refresh cookie: refresh first, so pages render with a fresh token |
| `ApiClient` | `src/lib/api/client.ts` | On 401 in the browser: one refresh, retry once; if that fails, the session-expired handler runs |
| Handler | `src/hooks/use-auth.ts` (`useSessionExpiry`) | Clears the query cache and goes to `/sign-in?next=<current page>` |
| Session | `src/lib/session/session.ts` (`getSession`) | `GET /session` with the visitor's cookies; layouts and pages use it |
| Sign-in and out | `useLogin`, `useLogout` | Sign-out clears the cache and the stored organization, then loads the sign-in page |

**Plugging in a real provider:** keep the cookie names in `src/lib/config/auth.ts` or change them; point `NEXT_PUBLIC_API_BASE_URL` at the API that sets them (same site, so the cookies are sent; for another origin the API must allow credentials and the cookies need `SameSite=None; Secure`). Verification of the token is the API's job; the proxy only checks that a token exists and has not expired.

**Production:** the sample API refuses every request when `NODE_ENV=production` unless `ALLOW_SAMPLE_API=true`, and `AUTH_JWT_SECRET` must be set. The cookies are `HttpOnly`, `SameSite=Lax` and `Secure` in production. A 403 from a query shows "not authorized" in place; from a page, call `forbidden()`.

## Performance

`npm run measure:bundles` builds a clone and reports the JavaScript each route loads (compressed bytes, first visit). Measured on 2026-10-01 (Next.js 16.3, 1280 px):

| Routes | JS files | JS, compressed |
|---|---|---|
| Public pages (landing, legal, help, contact, organization profiles) | 15 | about 311 KB |
| Signed-in pages (inside the shell) | 15 to 17 | 326 to 341 KB |

The three largest chunks (101, 71 and 43 KB) are React, Next.js and the shared runtime; the app's own code adds about 17 KB over a public page. The notifications panel and the display settings are small and part of every signed-in page, so they are not split out: lazy loading them would save little and delay controls the user reaches for first. Re-measure after adding a heavy dependency (a chart or editor library) and load that one lazily with `next/dynamic`. The Query Devtools are only in development.

## Errors and monitoring

Every error goes through `reportError` in `src/lib/monitoring/report-error.ts`: error boundaries, the sample API, errors no boundary caught (`window` `error` and `unhandledrejection`) and server errors (`src/instrumentation.ts`, `onRequestError`). The default writes to the console; call `setErrorReporter(fn)` once at startup, or edit the file, to send them to Sentry, Datadog or your own endpoint.

## Search engines

Public pages set a title, description and canonical URL (`buildMetadata`); `/robots.txt` and `/sitemap.xml` come from `src/app`. The default Open Graph image is generated in `src/app/opengraph-image.tsx` (replace it with a designed `opengraph-image.png` or set `ogImage` in `lib/config/site.ts`). Organization profiles also embed schema.org JSON-LD (`Hospital`, `Pharmacy` or `Organization`). Unknown profile URLs show the 404 page; because the page streams, the status is 200 with `noindex` (Next.js cannot change a status after streaming starts).

## Security

- **Headers** (`next.config.ts`): a Content-Security-Policy (same-origin scripts, styles, fonts and connections, plus the API origin from `NEXT_PUBLIC_API_BASE_URL`; no plugins, no framing, forms only to this site), `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and HSTS in production (`upgrade-insecure-requests` is added only when `NEXT_PUBLIC_SITE_URL` starts with `https://`; set it in production, it is also the base of canonical URLs, the sitemap and Open Graph links). Inline scripts stay allowed because the theme and text size are applied by inline scripts in `<head>` before first paint; to remove `'unsafe-inline'`, issue a nonce per request in `src/proxy.ts` and pass it to those scripts.
- **Cookies:** the token cookies are `HttpOnly`, `SameSite=Lax` and `Secure` in production. The cookies the browser writes itself (`sidebar-collapsed`, `active-organization`, `active-role`) and the language cookie hold no secrets.
- **Server actions:** the only one left is `setLocale`, which needs no session. A new action that touches user data must check the session itself (`getSession()`), never trust that the page already did.
- **Authorization:** hiding a menu item is not protection; check roles on the server (see "Restrict a page by role") and in the API.

## State

Each piece of state has one owner, and nothing is copied from one owner to another. Add new state to this table in the same change.

| State | Owner | Where | Persisted |
|---|---|---|---|
| Server data (lists, menus, notifications, profile, session) | TanStack Query | `src/hooks/use-*.ts` | no |
| Sidebar collapsed, drawer and "More" sheet open | Zustand | `src/lib/stores/ui-store.ts` | collapsed flag, in a cookie |
| Active organization | Zustand | `src/lib/stores/organization-store.ts` | cookie |
| Active role (act as one of several) | Zustand | `src/lib/stores/role-store.ts` | cookie |
| Tab, filter, page (shareable view state) | URL, via nuqs | `src/hooks/use-list-params.ts` | the URL |
| Form values | React Hook Form with Zod | `src/components/auth`, `src/components/examples` | no |
| Effective roles, filtered menu, page title | computed in render | `useMenu`, `SessionProvider` | no |
| Open popover, hovered row | `useState` | components | no |
| Theme, style, font size, language | `<html>` attributes plus `localStorage` (theme, size) or a cookie (language) | `src/components/appearance` | yes, applied by a script in `<head>` before first paint |

**Inspecting state:** in `npm run dev` the TanStack Query Devtools button appears at the bottom corner (queries, cache, mutations). The Zustand stores are small: read them with `useUiStore.getState()` style access in a component while debugging, or watch the cookies `sidebar-collapsed`, `active-organization` and `active-role` in the browser's storage panel.

Cookie-backed state is read on the server (`src/lib/session/initial-state.ts`) so the first render already matches; the stores do not rehydrate on the client (`skipHydration`). On sign-out the query cache is cleared and the stored organization removed.

**Query defaults** (`src/providers/query-provider.tsx`): `staleTime` 60 s so server-rendered data is not refetched at once; up to two retries for network and server errors but none for 401, 403, 404 and 422; no refetch on window focus except the session and notifications, which change without the user; mutations never retry.

## Replace the sample backend with a real API

1. Set `NEXT_PUBLIC_API_BASE_URL` to the real server (for example `https://api.example.com/v1`). Until then the app calls its own `/api/v1`.
2. If the real answers differ from the sample ones, change only the schemas in `src/lib/schemas/` and the bodies of the `src/lib/services/*.service.ts` functions. Hooks and components stay as they are.
3. Delete `src/api/` and `src/app/api/` once nothing needs the sample data.
4. Replace the sample sign-in: your API implements `/auth/login`, `/auth/refresh` and `/auth/logout` from the contract (see "Authentication"); `src/api/jwt.ts` and `src/api/auth.ts` disappear with `src/api`.
5. Replace `src/lib/config/site.ts` and `account-menu.ts` with your values, or load them from the API.

## Common changes

**Add a page.** Create `src/app/(dashboard)/my-page/page.tsx`, export `metadata = buildMetadata({ title, description, path })` and render `PageContainer` and `PageHeader`. No shell change is needed. Public pages go under `(public)`; add their URL prefix to `PUBLIC_PATH_PREFIXES` in `src/lib/config/auth.ts`.

**Add a menu item.** Menus are data: add an entry to the organization's menu (`src/api/data/menus.ts`, or your API) with `id`, `label`, optional `labelKey`, `icon`, `href`, `children`, `badge`, `requiredRoles` and `requiredPermissions` (both must pass; a permission requirement the user lacks hides the entry). Ids must be unique within a menu. Icons are names in the registry `src/components/navigation/menu-icons.ts`; add a Lucide icon there to use it.

**Restrict a page by permission.** Roles are what the API reports per organization; permissions are what the code checks. `src/lib/authorization/` is a pure evaluator ported from the rxprofile web app: scoped contexts (personal, organization, branch, platform), validity windows, memberships and assignments, deny overrides that always win, and fail-closed defaults. `role-templates.ts` says what each role grants and `permissions.ts` lists every permission with its scope; replace both with your own. Check on the server, as `(dashboard)/admin/page.tsx` does: `(await getActivePermissions()).includes("organization.access.view")`, then call `forbidden()`. In components, `useActiveOrganization().permissions` has the same list. Hiding the menu item is not protection, and the evaluator is for the interface only: the API must enforce access again. `authorizationFromSession` (`from-session.ts`) turns the session into the evaluator's inputs; map validity windows, branches or overrides there when your API reports them.

**Add an organization type.** Add an entry to `src/lib/config/organization-types.ts`, a member to `OrganizationDetails` in `src/lib/types/organization.ts` with its profile section in `components/organization/public-profile.tsx`, and a folder `src/app/(public)/{segment}/[slug]/page.tsx` (copy an existing one). Add `organizationType.{key}` to the message catalogs.

**Add a language.** Add the code to `locales` and an entry (flag, native name, `dir`) to `localeMeta` in `src/lib/i18n/config.ts`, a catalog `src/lib/i18n/messages/{code}.json` (same keys as `en.json`), one loader in `src/lib/i18n/messages.ts`, and `locale.{code}` to every catalog. For a script that needs its own font, register it in `src/lib/fonts/fonts.ts` and map it in `src/styles/typography.css`. A right-to-left language sets `dir: "rtl"` in `localeMeta`; the root layout puts it on `<html>`, and the shell uses logical utilities (`ms-`, `ps-`, `start-`) so it mirrors. Popover placements such as `right-start` are physical in bokoui and do not mirror yet. `npm run check` fails when a catalog lacks a key or a placeholder of `en.json`.

**Numbers and plurals.** Never put a bare `{count}` in a message: write `{count, number}` so Bangla shows Bengali digits, and use ICU plurals where a noun changes (`{count, plural, one {# item} other {# items}}`). The rules differ by language: in Bangla both 0 and 1 are "one", in English only 1 is. Dates and numbers outside messages go through `src/lib/i18n/format.ts`.

**Change fonts or the type scale.** Fonts: `src/lib/fonts/fonts.ts` (families) and `src/styles/typography.css` (mapping and scale tokens). The optional header font picker is off by default; set `features.fontSwitcher` in `src/lib/config/features.ts`.

**Add a page without the shell** (print views, public display screens). Only the `(dashboard)` route group renders the sidebar and header. Put such a page in a group of its own (for example `src/app/(print)/print/...`) with a bare layout, and keep its URL out of the menus. It is not in `PUBLIC_PATH_PREFIXES` unless it needs no sign-in.

**Keyboard shortcuts.** `Ctrl/Cmd+K` focuses the search, `Ctrl/Cmd+B` collapses the sidebar, `Alt+N` opens notifications; the hints show in tooltips and `aria-keyshortcuts`. The list is `src/lib/config/shortcuts.ts`; set `features.keyboardShortcuts` to `false` to turn them all off. Shortcuts without a modifier never fire while typing in a field.

**Header search.** A select picks the content area (menu, people, organizations, hospitals, pharmacies; `src/lib/config/search.ts`). The menu scope searches the loaded menu in the browser; the others call `GET /search?scope=&q=` (contract: `src/lib/contract`). To add an area: add it to `searchScopes`, handle it in the API, add `search.scope.{id}` to the catalogs.

**Sample users for edge cases.** Sign in with an email starting `empty@` (no organization: a "not part of an organization" page) or `many@` (63 organizations with long names, each with the large menu).

**Change the bottom navigation.** `bottomNavSlots` in `src/lib/config/navigation.ts` sets how many slots the bar has, counting "More".

## Notes

- Public organization profiles are fetched on demand and cached for an hour with `unstable_cache` (`src/lib/organization/public-organization.ts`). The app does not use Cache Components, because the root layout reads cookies (locale, sidebar state).
- `forbidden()` needs `experimental.authInterrupts` in `next.config.ts`; it is experimental in this Next.js version.
- Jotai and Redux Toolkit are deliberately not installed (SRS FR-9.6).

## Styles

The display settings menu and `/examples/styles` (the style gallery) list 20 styles, including the 12 material ones (glassmorphism, neumorphism, claymorphism, ...). Sample screens that show a style at work: `/examples/showcase-home`, `/examples/showcase-settings`, `/examples/showcase-calculator` and `/dashboard`. The header, footer and hero use the `surface-card` utility, `AppFrame` lets the page gradient show (`--bokoui-page-bg`), and the mobile bottom bar is the `FloatingNav` pill.
