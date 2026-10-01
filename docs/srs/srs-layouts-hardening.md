# Software Requirements Specification: Layout Hardening Before Real Data

Extends: [srs-layouts.md](srs-layouts.md) (the shell itself) and [plan-layouts-reference-ui.md](../plan-layouts-reference-ui.md) (the reference UI alignment).
Version: 0.3 (draft) | Date: 2026-10-01
Host project reviewed: `/Users/wl/Workspace/projects/goribco/rxprofile/apps/web` (read-only review; see section 2.6 and appendix A)

## 1. Introduction

### 1.1 Purpose
List the work to finish in `examples/next-js-layouts/` before it is copied into another project and wired to that project's real data. The shell and its mock data layer already exist. This document covers what is still unverified, what is still mock-only, and what makes the copy easy and safe.

### 1.2 Scope
In scope: verification, tests, the data and auth seams, edge cases of the shell, configuration for reuse, and production readiness. Out of scope: real business pages, the real API, and new bokoui components.

### 1.3 Priority
M = must do before copying, S = should do, C = could do. Items marked **First** are the recommended first three workstreams (section 2.1, 2.2 and 2.4). Section 2.6 holds decisions that must be made **before** any of them, because the host project already differs from this example in important ways.

### 1.4 Current state (baseline)
- Shell, switcher, header, display settings dropdown, notifications panel with tabs, landing page, and legal pages are built.
- Lint and typecheck pass. Spot checks with axe found no violations at 1280 px and 390 px, mostly in the flat style and light mode.
- Not yet checked: dark mode, tablet widths, Bangla, the other 7 styles (partly checked for two components), screen readers.
- No automated tests. Unit tests, browser checks and the acceptance walk-through are deferred in `tasks-layouts.md`.
- Data now follows the host project's layering (section 2.7). The sample backend lives in `src/api` (data files in TypeScript, one handler file per resource, a route table) and is served over HTTP at `/api/v1/*` by `app/api/v1/[...path]/route.ts`. `lib/api/client.ts` calls it, `lib/services/*.service.ts` validate the answers with Zod, `hooks/use*.ts` wrap the services in TanStack Query, and components use only the hooks. Server Components use the same services through `getServerServices()`.
- The session is still a cookie with the value `mock-session`; sign-in and sign-out are server actions, not API endpoints.
- A browser pass over the changed pages (dashboard, notifications, organizations, filters, table, form, profile, public profile, landing) at 1280 px found no errors and no axe violations on the pages scanned.
- Stub pages remain for `/account` and `/settings/privacy`. `/organizations` and `/notifications` now read real endpoints.
- A shadcn/ui copy of the shell exists in `examples/next-js-shadcn-ui` for comparison; the owner prefers the bokoui version (see HD-6.1).

## 2. Requirements

### 2.1 Verification and tests (First)
| ID | Requirement | P |
|---|---|---|
| HD-1.1 | Unit tests cover menu filtering by role, menu flattening and active-trail lookup, `can()` and the active-roles helpers, `safeReturnPath` and `isPublicPath`, and the UI store (collapse, drawer, persistence) | M |
| HD-1.2 | A single browser script (puppeteer-core with axe-core) visits every route at 390, 768 and 1280 px, in all 8 styles and both modes, and fails on any axe violation, horizontal scroll or console error | M |
| HD-1.3 | The same script covers the interactive parts: sidebar collapse and reload persistence, mobile drawer focus trap and Escape, workspace switcher, account menu, display settings dropdown, and every notification tab | M |
| HD-1.4 | The script runs against a copy of the app built from a clone, never inside a running example | M |
| HD-1.5 | Verify Bangla: every message key exists in `en.json` and `bn.json` (a test fails on a missing key), and layouts do not break with the longer strings and the Bengali font | M |
| HD-1.6 | Manual pass with a screen reader on the shell, the three menus and the notifications panel; record findings | S |
| HD-1.7 | Walk through the acceptance criteria in `srs-layouts.md` section 6 and tick them in `tasks-layouts.md` | M |
| HD-1.8 | One command (`npm run check`) runs lint, typecheck, unit tests and a production build | M |

### 2.2 Data and authentication seams (First)
| ID | Requirement | P |
|---|---|---|
| HD-2.1 | **Done for the sample backend (`src/api` over HTTP).** A second, real-API implementation of the `services` interfaces (a `fetch`-based client with a configurable base URL) sits beside the mock, so the interfaces are proven against a real backend shape. A single setting selects mock or API | M |
| HD-2.2 | **Done for all current endpoints.** Every service response is validated with the Zod schemas in `lib/schemas`; TypeScript types are inferred from those schemas, so an API change shows as a type error | M |
| HD-2.3 | **Partly done:** hooks expose `isPending` and `isError` and the list pages use them; the shell sidebar still lacks an error state with retry. TanStack Query hooks expose loading, error and retry states. The shell shows a skeleton while the menu loads and an inline error with a retry button when it fails | M |
| HD-2.4 | A central handler treats 401 as an expired session (clear state, redirect to sign-in with a return path) and 403 as the forbidden view | M |
| HD-2.5 | The session seam is documented: where the real provider plugs in (`getSession`, the proxy, sign-in and sign-out actions), with an example for one provider. The mock cookie is never accepted when `NODE_ENV` is production | M |
| HD-2.6 | **Done:** `GET /notifications` and `POST /notifications/read`, an optimistic `useMarkNotificationsRead`, shared by the bell and the notifications page. Notifications go through a service (list, mark read, mark all read) with read state kept on the server. The bell badge uses the unread count from that service | S |
| HD-2.7 | **Polling done (60 s refetch interval);** push is not. Optional live updates for notifications and the unread count (polling interval or a push hook), off by default | C |
| HD-2.8 | Active role switching: a user with several roles in an organization can choose the active role, and menus and access checks follow it | S |

### 2.3 Shell edge cases and gaps
| ID | Requirement | P |
|---|---|---|
| HD-3.1 | The shell is checked with: a menu of 300+ items, 5 levels of nesting, 50+ organizations, very long organization, user and menu names, and a user with zero organizations (a clear empty state, no crash) | M |
| HD-3.2 | When the menu fails to load, the sidebar shows an error with retry, and the rest of the shell stays usable | M |
| HD-3.3 | Header search either opens a command palette (`Ctrl+K`, using the menu as its first source) or is removed; it must not stay as an inactive box | S |
| HD-3.4 | Every route group has `loading.tsx`, `error.tsx` and `not-found.tsx` that use the shell; a skeleton exists for the whole shell on first load | S |
| HD-3.5 | Keyboard shortcuts for the common actions (toggle sidebar, open search, open notifications) with a visible hint in the tooltip, and a way to turn them off | C |
| HD-3.6 | Stub pages (`/organizations`, `/notifications`, `/account`, `/settings/privacy`, `/help`, `/contact`) are listed in the README as "replace before launch" | M |

### 2.4 Reuse as a skeleton (First)
| ID | Requirement | P |
|---|---|---|
| HD-4.1 | One configuration module holds everything that rebrands the app: product name, logo, description, site URL, contact and support emails, default style and mode, locales, and feature flags. No other file hardcodes "Bokoui Layout" or `example.com` addresses | M |
| HD-4.2 | Demo code is isolated so it can be deleted in one step: the `/examples/*` pages, `lib/sample-data.ts`, `lib/services/mock`, and the landing page content. Deleting them leaves a working app | M |
| HD-4.3 | The README starts with a "start here" checklist: replace services, auth, branding, menus, legal text, locales, and delete the demo pages. Each step names the file | M |
| HD-4.4 | Legal text lives in one content file and can be replaced or loaded from a CMS without touching components (done in `lib/content/legal.ts`; the placeholder email and company name come from HD-4.1) | S |
| HD-4.5 | The dependency on `bokoui` is documented: which published version the copy should use, how to install it outside the local registry, and how to update it | M |
| HD-4.6 | The folder structure and naming rules are written down in the README so the host project keeps them | S |

### 2.5 Quality and production readiness
| ID | Requirement | P |
|---|---|---|
| HD-5.1 | Performance: measure the bundle per route; load the notifications panel, display settings and other panels lazily if they add noticeably to the first load. Record the numbers | S |
| HD-5.2 | Security: set a Content-Security-Policy and other security headers; cookies are `httpOnly`, `secure` and `sameSite` in production; server actions check the session themselves | M |
| HD-5.3 | Accessibility: no axe violations on any route; visible focus on every control; touch targets of at least 44 px on touch screens (already used in the shell, verify) | M |
| HD-5.4 | Internationalization: plural and number rules checked in both languages; adding a language is a documented, tested procedure; layout works with right-to-left text if a right-to-left language is added | S |
| HD-5.5 | SEO: Open Graph image, structured data on organization profiles, a custom 404, and a canonical URL on every public page | S |
| HD-5.6 | Continuous integration: a workflow runs `npm run check` and the browser script on each pull request | S |
| HD-5.7 | Error reporting hook: a single place to send client and server errors to a monitoring service | C |

### 2.6 Alignment with the host project (rxprofile/apps/web) (Decide first)
The host app already contains a working shell of its own (`DashboardLayout`, `AppSidebar`, `WorkspaceSwitcher`, `AccountMenu`, `FeatureTabs`, `MobileSectionTabs`) built on shadcn/ui, and the workspace switcher labels ("Workspaces", "Manage workspaces", "Personal Healthcare") match the reference screenshots. So this example is not a first shell for that project. Its value is the patterns and fixes it adds to an existing one. Details are in appendix A.

| ID | Requirement | P |
|---|---|---|
| HD-6.1 | **Status: a shadcn copy was built and rejected by the owner, who prefers bokoui; the remaining choice is how to bring bokoui into the host (B or the gradual path in the chat summary), not whether.** **Decide the UI library path before copying.** The host uses shadcn/ui (Radix, owned code in `components/ui`) and class-based dark mode (`.dark`); this example uses `bokoui/react` with `data-theme` and `data-mode`. Choose one: (A) port the new patterns onto the host's shadcn components, keeping the host's theme tokens; (B) adopt bokoui in the host, replace the shadcn tokens and dark-mode mechanism, and migrate the existing UI; (C) copy only logic (menus, edge cases, tests) and leave all markup to the host. Record the choice in the host's docs. Recommended: A, because a full migration is large and every existing host screen already uses shadcn components | M |
| HD-6.2 | Authorization: the host evaluates scoped permissions (personal, organization, branch, platform) with a pure evaluator that fails closed, deny wins, and every route and menu entry carries a `PermissionId`. This example uses a flat role check. Re-express the menu filtering and page guards on the host's `evaluate`, `<Can>` and `useAuth().can`, and remove this example's `lib/access` | M |
| HD-6.3 | Workspace model: the host treats a workspace as a menu section with a scope, and switching navigates to that section's overview URL (`/workplaces/{slug}/...`), so the URL carries the workspace. This example keeps the active organization in a store and cookie. Use the host's URL-scoped model; keep this example's switcher only as a visual pattern (search above 6 entries, type subtitle, "Manage workspaces") | M |
| HD-6.4 | Authentication: the host uses client-side JWT access and refresh tokens in `localStorage`, with `RouteGuard` and `AuthProvider`. This example uses a server cookie, `proxy.ts` and server-side redirects, which also require a server runtime (the host has a GitHub Pages deploy workflow, and its docs mention an earlier static-export phase, so confirm how it is deployed today). Decide: keep the host's client auth and drop the proxy and server session from the copy, or move the host to httpOnly cookies (an API change). Do not mix both | M |
| HD-6.5 | Internationalization: the host keeps typed dictionaries in `packages/i18n` (English defines the `Translations` type, Bangla is checked against it) and reads them with `useUiLang().t`; it also has Hindi and a separate content language. Move this example's messages into `@rxprofile/i18n` (`en`/`bn`, and `hi` if used) and replace `next-intl` calls, instead of adding a second i18n system | M |
| HD-6.6 | Data access: follow the host's rule that components never call `fetch` or `apiClient`; every feature is `page` (thin) to client component to `useX` hook to `lib/services/x.service.ts` to `apiClient` or a mock. When replacing a mock keep the service's exported names and return types. Map this example's `lib/services` interfaces onto that layout rather than adding a parallel one | M |
| HD-6.7 | API client: reuse the host's `apiClient` (Bearer token, 401 then one refresh and retry, `{success, results}` unwrapping, `ApiError` with `status` and `body`, `getPage` with `meta`) for HD-2.1 to HD-2.4 instead of writing a new one. Add only what is missing: a global handler that turns a failed refresh into sign-out with a return path, and a typed way to show 403 | M |
| HD-6.8 | Types and IDs: map the menu schema to `@rxprofile/types` (`RoleBasedMenuSection`, `RoleBasedMenuItem`) and the host's `MenuSection` (with `scope`). Use public UUIDv7 IDs and slugs in URLs, never internal integer IDs | M |
| HD-6.9 | Routing conventions: host links end with `/` (`trailingSlash: true`), the app can run under `NEXT_PUBLIC_BASE_PATH`, and static asset URLs use `BASE_PATH`. Every link, redirect and `path` in the copied code must follow this. Local storage and cookie keys use the host's `preferenceKey()` so sites under one domain do not share preferences | M |
| HD-6.10 | Route registry: new pages register a `PermissionId`, an entry in `routes.manifest.ts` (public or authenticated, indexable, permission), and, when they belong in the sidebar or tabs, a feature group in `features.ts`. The landing page, legal pages, `/notifications` and `/organizations` follow that checklist; the host already has a public home and a `(content)/privacy` page, so decide whether the new landing page replaces, extends, or is dropped | M |
| HD-6.11 | Legal and static content: the host loads site content from Markdown (`content/pages/{en,bn,hi}`) through `lib/content/loaders.ts` (server only). Put the terms and privacy text there, and delete `lib/content/legal.ts` and `LegalDocument` content, keeping only the table-of-contents layout as a component | S |
| HD-6.12 | Appearance: the host has `ThemeProvider`, `FontSizeProvider`, `UiLanguageProvider`, `ContentLanguageProvider` and speciality color themes. The display settings dropdown must use those providers (not a second set of stores), keep UI language and content language distinct, and offer the speciality theme if the host exposes one. Replace the host's font-size handling, which sets a pixel size in an effect after mount (a visible resize on load), with this example's approach of a data attribute applied by a script in `<head>` before paint | S |
| HD-6.13 | Notifications: wire the panel to the host's real pieces: `services/notify` (WebSocket gateway on Redis, currently scaffolding) for live delivery and a notifications endpoint on `services/api` for list and mark-read. Until they exist, keep the mock behind a service. The existing `ReportNotifications` (diagnostic reports) becomes one notification kind | S |
| HD-6.14 | Shell-less routes: the host has pages that must not show the shell (`/print/*`, the public display screens under `(public)/(utility)/display`). The copied layout must leave them untouched and keep them out of the sidebar and the header | M |
| HD-6.15 | Mobile navigation: the host uses `MobileSectionTabs` and route-backed `FeatureTabs`; this example uses a bottom navigation and a drawer. Choose one pattern; do not ship both | M |
| HD-6.16 | Acting on behalf of someone: the host supports linked patients and family members (a `Person` without a `User`). The account menu and header need a defined place for "acting as", or an explicit decision that it stays in the settings pages | C |
| HD-6.17 | Dependency alignment: the host pins `zod` ^3.25 and `next` ^16.3.4; this example uses `zod` ^4.6 and `next` 16.3.7. Zod 3 and 4 have different APIs, so schemas copied from this example must be rewritten for the host's version or the host must upgrade first. The host does not use `zustand` or `nuqs`; add them only if the chosen path needs them, otherwise use the host's context providers and `useSearchParams` | M |
| HD-6.18 | Tests: follow the host's conventions: unit tests next to the code as `*.test.ts` with `node:test` (not Jest or Vitest), Playwright specs in `tests/` for desktop and an iPhone 13 profile on a separate dev server and dist directory. Port HD-1.1 to HD-1.3 into those tools. The host's baseline is 77 of 82 unit tests passing with 5 known failures; the copy must not add failures | M |
| HD-6.19 | Documentation: describe the copied shell in the host's `apps/web/CLAUDE.md` source map and `src/app/README.md` (route ownership), and fix or delete the stale `README.md` sections the host already warns about, instead of leaving a second README | S |

### 2.7 Data layer structure (adopt the host's pattern)
The host's rule is one direction only: `page` (thin) to client component to `useX` hook to `lib/services/x.service.ts` to `apiClient` to the server. Components never call `fetch` or `apiClient`. The example now follows it, with the sample backend behind HTTP so the swap to a real server is a configuration change.

```
src/
  api/                          the backend (deleted when a real one exists)
    data/*.ts                   sample data in TypeScript
    endpoints/*.ts              one handler file per resource: (context) => { results, meta?, status? }
    router.ts                   route table (method, path with :params, handler) and the { success, results, meta } envelope
    auth.ts  types.ts           session check, HttpError, handler types
  app/api/v1/[...path]/route.ts HTTP adapter for the router (GET, POST, PUT, PATCH, DELETE)
  lib/api/
    client.ts                   ApiClient: base URL, JSON, envelope, ApiError; `apiClient` for the browser
    server.ts                   getServerApi(): same client for Server Components, forwards cookies (server only)
    errors.ts                   ApiError, isApiError
  lib/services/
    <name>.service.ts           createXService(client): methods return validated, typed data
    index.ts                    createServices(client) and `services` (browser)
    server.ts                   getServerServices() (server only)
  lib/schemas/                  Zod schemas, one file per resource
  lib/query/keys.ts             query key factory shared by hooks and server prefetching
  hooks/
    use-<service>.ts            useOrganizations, useNotifications, useRecords, useProfile, useCommonMenu, ...
                                mutations: useMarkNotificationsRead, useCreateStaff
```

| ID | Requirement | P |
|---|---|---|
| HD-7.1 | **Layering is enforced:** a lint rule (or an import-boundary check) fails when a component imports `lib/api`, `lib/services` or `fetch`, when a service imports a hook or a component, or when anything outside `lib/api/server.ts` imports `next/headers` for data access | M |
| HD-7.2 | **Naming:** services are `<resource>.service.ts` exporting `create<Resource>Service(client)`; hooks are `use<Resource>` for reads and `use<Verb><Resource>` for mutations, in `hooks/use-<resource>.ts`; query keys live only in `lib/query/keys.ts`. The host names hooks `useDoctors`, `useAppointments`; when copying, keep the host's file naming (camel case) and these hook names | M |
| HD-7.3 | **Two clients, one service layer:** `apiClient` in the browser, `getServerApi()` on the server (cookies forwarded, absolute URL). Services take the client, so the same code runs in both places. The host has no server-side data fetching; if it stays client-only, `lib/api/server.ts` and `getServerServices` are dropped and Server Components stop reading data | S |
| HD-7.4 | **Contract:** every endpoint is described in one place (an OpenAPI file or shared Zod schemas in a package such as `@rxprofile/types`) that both `src/api` and the services use, so the sample backend cannot drift from the real one. Error codes (`UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION`, ...) and the paging `meta` shape are listed there | M |
| HD-7.5 | **Auth as endpoints:** sign-in, sign-out and token refresh become API endpoints (`POST /auth/login`, `/auth/refresh`, `/auth/logout`), and the 401 then refresh then retry flow of the host's client moves into `ApiClient`. The current server actions stay only if the cookie model is chosen (HD-6.4) | M |
| HD-7.6 | **Read-only versus write endpoints:** every mutation hook declares what it invalidates or updates in the cache (`useMarkNotificationsRead` does an optimistic update with rollback; `useCreateStaff` invalidates nothing because nothing is listed). New mutations follow one of those two shapes | S |
| HD-7.7 | **Paging, filtering and sorting** use one query-string convention (`page`, `pageSize`, `q`, `status`, `sort`) and one `meta` block; list hooks keep the previous page while loading and debounce text input | S |
| HD-7.8 | **Prefetch rule:** only what the first paint needs is prefetched in a layout (`commonMenu`, the active organization's menu); everything else loads in the hook. Prefetch and hook use the same key and the same service call | S |
| HD-7.9 | **Tests:** endpoint handlers are plain functions and get unit tests for success, 401, 403, 404 and validation; services get tests against a fake `ApiClient`; hooks get tests with a `QueryClientProvider` | M |
| HD-7.10 | **Mapping to the host:** the host's services are singleton functions over a shared `apiClient` and its mocks return `mockResponse()`. Move this example's `createXService(client)` shape to the host's function style, keep the service names, and replace `src/api` with the host's real endpoints (the host API already uses `{ success, results, meta }` and a `/v1` prefix, so the envelope and base URL match) | M |
| HD-7.11 | **Failure handling in the browser:** a global `QueryClient` default and an error boundary turn a failed query into a defined message with retry; a 401 anywhere signs the user out with a return path; a 403 shows the forbidden view | M |

### 2.8 State management
The rule is that each kind of state has one owner, and no state is copied from one owner to another.

| State | Owner | Where in the example | Rule |
|---|---|---|---|
| Server data (lists, menus, notifications, profile, session) | TanStack Query | `hooks/use-*.ts` | Never stored in Zustand or context; read through hooks; the session is a query seeded by the server (`useSessionQuery`) and `SessionProvider` only derives roles from it |
| Interface state that outlives a page (sidebar collapsed, "More" sheet) | Zustand | `lib/stores/ui-store.ts` | Persist only what the first server render needs (the collapsed flag, in a cookie); keep transient state (an open sheet) unpersisted |
| Active organization | Zustand with a cookie | `lib/stores/organization-store.ts` | Menus and permissions are keyed by it, so switching needs no manual invalidation. The host puts the workspace in the URL (HD-6.3); in that model this store is removed |
| Shareable view state (tab, filter, page) | URL through nuqs | `hooks/use-list-params.ts` | Anything a user could bookmark or send belongs here and also forms the query key |
| Form state | React Hook Form with Zod | `components/auth`, `components/examples` | Local to the form; the schema is shared with the server where one exists |
| Derived values (effective roles, filtered menu, page title) | Computed in render | `useMenu`, `SessionProvider` | `useMemo` or selectors; never stored |
| Short-lived component state (open popover, hovered row) | `useState` | components | Stays in the component |
| Appearance (theme, style, font size, language) | The `<html>` element and `localStorage` or a cookie | `components/appearance` | Applied before first paint by a script in `<head>`; read through small hooks |

| ID | Requirement | P |
|---|---|---|
| HD-8.1 | **State inventory:** the README lists every piece of state with its owner as in the table above, and a new piece of state is added to it in the same change | S |
| HD-8.2 | **Sign-out and organization switch reset what they must:** on sign-out the query cache and the stores are cleared (today a server redirect reloads the page, which hides the gap; a client-side sign-out would leave the previous user's data in the cache). On an organization switch, queries keyed by organization stay valid and organization-independent queries (`commonMenu`, `profile`) are kept | M |
| HD-8.3 | **Query defaults** are set once (`staleTime`, retry policy, refetch on focus for the session and notifications queries only) and documented with the reason for each; per-hook overrides are the exception | S |
| HD-8.4 | **Store hygiene:** each store exports typed selectors (done) and no component subscribes to a whole store; stores have unit tests for their actions and for cookie persistence (see HD-1.1) | S |
| HD-8.5 | **Hydration safety:** every value that differs between server and browser (stored theme, font size, collapsed flag, locale) is either seeded by the server from a cookie, or applied by a head script before React starts; no `useEffect` that changes the layout after mount | M |
| HD-8.6 | **Host alignment:** the host uses React context providers plus TanStack Query and no Zustand (HD-6.17). Decide whether the copy adds Zustand or keeps the host's providers: with the workspace in the URL, the remaining Zustand state is only the collapsed sidebar, which a small context or the library's own provider can hold. Query hooks and nuqs are kept either way | M |
| HD-8.7 | **Developer tooling:** TanStack Query Devtools in development only; a documented way to inspect the stores | C |

## 3. Recommended order
0. **Decide first (2.6):** HD-6.1 (UI library path), HD-6.4 (auth model), HD-6.2 and HD-6.3 (authorization and workspace model), HD-6.5 (i18n), HD-6.17 (dependency versions). These change the size and shape of everything below; if the answer is path A, much of 2.2 and 2.4 is replaced by the host's own pieces (HD-6.6, HD-6.7).
1. **Verification first (2.1):** HD-1.1, HD-1.2, HD-1.5, HD-1.8. These make every later change safe.
2. **Reuse (2.4):** HD-4.1 to HD-4.3. Cheap, and removes the biggest copy-time risk.
3. **Data seam (2.2, 2.7):** HD-2.1 to HD-2.3 are done for the sample backend. Next: HD-7.1 (enforce the layering), HD-7.4 (one contract), HD-7.5 (auth endpoints) and HD-7.11 (failure handling). Then HD-2.4 and HD-2.5.
3b. **State management (2.8):** HD-8.2 (reset on sign-out) and HD-8.5 (hydration safety) first, then the rest.
4. **Edge cases (2.3) and production readiness (2.5)** in parallel, then the remaining S and C items.

## 4. Acceptance criteria
1. `npm run check` passes, and the browser script reports no violations across all routes, 3 widths, 8 styles and 2 modes.
2. The app starts against the mock and against a stub HTTP server using the same interfaces, with no component changes.
3. A fresh copy of the folder, after following the README checklist and deleting the demo code, builds and signs in with a different data source.
4. No file outside the configuration module contains the product name or demo email addresses.
5. A component, hook or service added later can be traced through the layers in section 2.7 with no shortcut, and `src/api` can be removed by changing only `NEXT_PUBLIC_API_BASE_URL` and the service function bodies if the real contract differs.
6. The decisions in section 2.6 are written into the host project's docs, and no copied file uses a second i18n system, authorization model, API client or router convention.
7. A failed menu request, an expired session and a user with no organizations each show a defined screen, not a blank page or a crash.

## 5. Open questions
0. How does bokoui enter the host (HD-6.1): replace shadcn in one go, or screen by screen behind the host's own `components/ui` re-exports? Almost every other answer depends on it.
1. Does the host stay on client-side JWT auth (HD-6.4), or will it move to cookie sessions? That decides whether the proxy and server redirects are copied.
2. Will the host project run a command palette (HD-3.3), or should search be removed?
3. The host already has English, Bangla and Hindi; are any more planned, and does any need right-to-left (HD-5.4)?
4. Is a monitoring service already chosen (HD-5.7)?

## Appendix A. Review of the host project

Reviewed read-only: `apps/web/CLAUDE.md`, the root `CLAUDE.md`, `src/` structure, layouts, navigation, authorization, API client, providers, tests and CI. No host file was changed.

### A.1 Good structure already there (keep and reuse)
| Area | What the host does | Why it matters here |
|---|---|---|
| Data flow | `page` (thin server component) to `*Client` to `hooks/useX` (TanStack Query) to `lib/services/*.service.ts` to `apiClient` or `api/mocks`. Services are the only layer that talks to the API; components never call `fetch` | Same layering as this example's `services` and hooks; adopt the host's version (HD-6.6) |
| Mock to real migration | Each service is real or mock; migration is one vertical slice at a time and keeps exported names and return types stable; DTOs are mapped inside the service | Exactly the swap this example was built for; follow it for every replaced mock |
| API client | One `ApiClient`: base URL from config, Bearer token, 401 then refresh then one retry (not for `/auth/*`), unwraps `{success, results}`, `ApiError(status, body)`, `getPage` returns items with `meta` | Covers HD-2.1 to HD-2.4 already (HD-6.7) |
| Authorization | Pure evaluator in `lib/authorization`: scoped (personal, organization, branch, platform), explicit assignments, validity windows, fails closed, deny beats allow, tested; UI gating with `<Can>` and `useAuth().can`; the file states it is UX only and the API must enforce access | More capable than this example's role check (HD-6.2) |
| Navigation | `routes.ts` (full permission-filtered menu), `account-routes.ts` (personal menu), `workplace-templates.ts`, `routes.manifest.ts` (public or authenticated, indexable, permission, ownership check), `features.ts` (sidebar and tab grouping), reserved slug words | A central route registry; the copied pages must register in it (HD-6.10) |
| Workspaces | A menu section has a scope; the URL carries the workplace; `WorkspaceSwitcher` navigates to the section overview; `/workplaces/[...segments]` | URL-scoped model (HD-6.3) |
| Route groups | `(public)`, `(dashboard)`, `(doctors)`, `(hospital)`, `(pharmacy)`, `(pharma)`, `(admin)`, plus `print`; `src/app/README.md` explains ownership and says a group is never an authorization grant | Matches this example's `(auth)/(dashboard)/(public)` idea with more detail |
| i18n | Typed dictionaries in `packages/i18n`, English defines the type and Bangla is checked against it, `{placeholders}`, `Intl.*(lang)` for numbers and dates | Compile-time guard that HD-1.5 asks for (HD-6.5) |
| Deployment helpers | `lib/site/deployment.ts`: `BASE_PATH`, `preferenceKey()` namespacing local storage per site | Must be used for every storage key (HD-6.9) |
| Identifiers | Internal integer IDs never leave the API; public UUIDv7 IDs and slugs | Constrains schemas and URLs (HD-6.8) |
| Tests | Colocated `*.test.ts` on `node:test`; Playwright with a desktop and an iPhone 13 project, own dev server and dist directory; documented baseline | Tooling for HD-1.x (HD-6.18) |
| Documentation | `CLAUDE.md` at the root and per app with a source map, "how a feature is wired", conventions, and an explicit stale-docs warning; READMEs for authorization, routes and content | Pattern to follow (HD-6.19) |
| Content | Markdown site content per language, loaded on the server at build, with a README on editing it | Right home for legal text (HD-6.11) |
| Shared packages | `@rxprofile/types`, `@rxprofile/i18n`, `bokolib` consumed from built `dist/` | Menu and DTO types already exist (HD-6.8) |

### A.2 Where the host differs from this example (resolve before copying)
| Topic | Host | This example | Requirement |
|---|---|---|---|
| UI components | shadcn/ui on Radix, owned in `components/ui` | `bokoui/react` | HD-6.1 |
| Theming and dark mode | `.dark` class, `ThemeProvider`, speciality color themes, semantic tokens in `globals.css` | `data-theme` and `data-mode`, `ThemeScript` in `<head>` | HD-6.1, HD-6.12 |
| Auth | Client-side JWT in `localStorage`, `RouteGuard`, `AuthProvider` | Cookie session, `proxy.ts`, server redirects, server actions | HD-6.4 |
| Authorization | Scoped permissions with `PermissionId` per route | Flat role check | HD-6.2 |
| Workspace state | In the URL and menu section | Zustand store and cookie | HD-6.3 |
| i18n | `@rxprofile/i18n`, `useUiLang`, en, bn, hi, separate content language | `next-intl`, cookie locale, en and bn | HD-6.5 |
| URLs | Trailing slash, optional base path | No trailing slash, no base path | HD-6.9 |
| State libraries | TanStack Query, React context | TanStack Query, Zustand, nuqs | HD-6.17 |
| Versions | `zod` ^3.25, `next` ^16.3.4 | `zod` ^4.6, `next` 16.3.7 | HD-6.17 |
| Mobile navigation | `MobileSectionTabs`, route-backed `FeatureTabs` | Bottom navigation and drawer | HD-6.15 |
| Font size | Pixel size set in an effect after mount (visible resize on load) | Data attribute set before paint | HD-6.12 |
| Legal text | Markdown content pages | TypeScript content file | HD-6.11 |
| Landing page | A public home already exists | New landing page at `/` | HD-6.10 |
| Notifications | `ReportNotifications` (diagnostics), `services/notify` WebSocket gateway (scaffolding) | Mock list in a popover | HD-6.13 |
| Print and display screens | Shell-less routes | Not covered | HD-6.14 |
| CI | One workflow, deploy to GitHub Pages on `main`; no check workflow | None | HD-5.6 |
| Test baseline | 77 of 82 pass, 5 known failures | No tests | HD-6.18 |

### A.3 Things the host could take from this example
These are improvements to the host's existing shell, independent of the UI library choice:
- A single header toggle that collapses the sidebar on desktop and opens the drawer on mobile.
- The display settings dropdown (theme, design or speciality theme, font size, language) in the header, replacing the trip to the settings page for quick changes.
- A notifications panel with tabs (All, Unread, Urgent, Invitations), mark-all-read and unread count.
- A workspace switcher that searches when the list is long.
- A no-flash font size, and the `tabular-nums`, hit-target and focus-ring details checked with axe.
- The edge-case checks in HD-3.1 and the browser script in HD-1.2 (the host has Playwright specs but none that sweep every route for accessibility).
