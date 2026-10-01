# Task List: Layout Hardening Before Real Data

Based on: [SRS](../srs/srs-layouts-hardening.md)
Legend: `[ ]` todo, `[x]` done, `[~]` partly done. Priority in brackets: M must, S should, C could. Each task names the requirement ID (HD-x.y) from the SRS. Phases follow the recommended order in SRS section 3.

Working rules:
- Work in `examples/next-js-layouts/` unless a task says otherwise. Host project (`rxprofile/apps/web`) is read-only; decisions about it are recorded as docs, not code changes.
- Run browser checks on a copy built from a clone, never inside a running example (HD-1.4).
- Tick the checkbox when a task is finished. When a phase 0 decision changes the scope of a later task, note the decision next to that task.

## Phase 0: Decisions before any work (SRS 2.6, section 5)
Record each answer in the host's docs (HD-6.19) and in the README of the example.
- [ ] T0.1 [M] HD-6.1 Choose how bokoui enters the host: replace shadcn in one go, or screen by screen behind the host's `components/ui` re-exports. The owner already rejected shadcn (shadcn copy rejected); the open part is the migration path
- [ ] T0.2 [M] HD-6.4 Choose the auth model: keep the host's client JWT (drop `proxy.ts` and the server session from the copy) or move to httpOnly cookies. Confirm how the host is deployed today (GitHub Pages static export vs server runtime). Do not mix both
- [ ] T0.3 [M] HD-6.2 Decide authorization: re-express menu filtering and guards on the host's `evaluate`, `<Can>`, `useAuth().can`; plan removal of `lib/access`
- [ ] T0.4 [M] HD-6.3 Decide workspace model: URL-scoped (`/workplaces/{slug}/...`) as in the host; keep this switcher only as a visual pattern
- [ ] T0.5 [M] HD-6.5 Decide i18n: move messages into `@rxprofile/i18n` (`en`, `bn`, `hi`) and drop `next-intl` in the copy
- [ ] T0.6 [M] HD-6.17 Decide dependency alignment: rewrite schemas for `zod` ^3.25 or upgrade the host first; add `zustand` and `nuqs` only if needed (ties to T0.7)
- [ ] T0.7 [M] HD-8.6 Decide state libraries: keep host providers or add Zustand; query hooks and nuqs stay either way
- [ ] T0.8 [M] HD-6.15 Choose one mobile navigation pattern: bottom nav and drawer, or `MobileSectionTabs` and `FeatureTabs`
- [ ] T0.9 [S] Answer open questions 2 to 4: command palette or remove search (HD-3.3), extra languages and RTL (HD-5.4), monitoring service (HD-5.7)

## Phase 1: Verification and tests (SRS 2.1, 2.8, 2.7)
- [ ] T1.1 [M] HD-1.1 Unit tests: menu filtering by role, flattening, active-trail lookup, `can()` and active-roles helpers, `safeReturnPath`, `isPublicPath`
- [ ] T1.2 [M] HD-1.1, HD-8.4 Unit tests for the UI store (collapse, drawer, cookie persistence) and the organization store
- [ ] T1.3 [M] HD-1.5 Message-key test: fail when a key exists in only one of `en.json` and `bn.json`
- [ ] T1.4 [M] HD-7.9 Tests for `src/api` endpoint handlers (success, 401, 403, 404, validation), services against a fake `ApiClient`, hooks inside a `QueryClientProvider`
- [ ] T1.5 [M] HD-1.8 Add `npm run check`: lint, typecheck, unit tests, production build
- [ ] T1.6 [M] HD-1.2, HD-1.4 Browser sweep script (puppeteer-core + axe-core) run against a built clone: every route at 390, 768 and 1280 px, 8 styles, both modes; fails on axe violation, horizontal scroll or console error
- [ ] T1.7 [M] HD-1.3 Extend the script to interactions: sidebar collapse and reload persistence, drawer focus trap and Escape, workspace switcher, account menu, display settings dropdown, every notification tab
- [ ] T1.8 [M] HD-1.5 Bangla layout check inside the sweep (longer strings, Bengali font)
- [ ] T1.9 [M] HD-5.3 Fix everything the sweep finds; confirm visible focus on all controls and 44 px touch targets
- [ ] T1.10 [M] HD-1.7 Walk through the acceptance criteria in `srs-layouts.md` section 6 and tick them in `tasks-layouts.md`
- [ ] T1.11 [S] HD-1.6 Screen reader pass on the shell, the three menus and the notifications panel; record findings
- [ ] T1.12 [M] HD-6.18 Port T1.1 to T1.7 to the host's tools (`node:test`, Playwright desktop and iPhone 13); do not add failures to the host's baseline of 5

## Phase 2: Reuse as a skeleton (SRS 2.4)
- [ ] T2.1 [M] HD-4.1 One configuration module (product name, logo, description, site URL, emails, default style and mode, locales, feature flags); remove every other hardcoded "Bokoui Layout" and `example.com`
- [ ] T2.2 [M] HD-4.2 Isolate demo code (`/examples/*` pages, `lib/sample-data.ts`, mock services, landing content) so deleting it leaves a working app; verify by deleting in a scratch copy
- [ ] T2.3 [M] HD-4.3 README "start here" checklist: services, auth, branding, menus, legal text, locales, delete demo; each step names the file
- [ ] T2.4 [M] HD-4.5 Document the `bokoui` dependency: version to use, install outside Verdaccio, update procedure
- [x] T2.5 [S] HD-4.4 Legal text in one content file (`lib/content/legal.ts`); [ ] still needs placeholder email and company name to come from T2.1
- [ ] T2.6 [S] HD-4.6 Write the folder structure and naming rules in the README
- [ ] T2.7 [M] HD-3.6 List stub pages (`/account`, `/settings/privacy`, `/help`, `/contact`) in the README as "replace before launch" (`/organizations` and `/notifications` now read real endpoints)

## Phase 3: Data and authentication seams (SRS 2.2, 2.7)
Already done: sample backend over HTTP, services with Zod validation, hooks, notifications endpoints.
- [x] T3.1 [M] HD-2.1 Real-API implementation beside the mock (`src/api` over `/api/v1/*`, `ApiClient` with base URL)
- [x] T3.2 [M] HD-2.2 Every service response validated with Zod schemas; types inferred
- [x] T3.3 [S] HD-2.6 Notifications service: list, mark read, mark all read, optimistic `useMarkNotificationsRead`, unread count on the bell
- [~] T3.4 [C] HD-2.7 Notification polling (60 s) done; [ ] push hook not done, stays off by default
- [~] T3.5 [M] HD-2.3 List pages use `isPending` and `isError`; [ ] sidebar menu skeleton and inline error with retry
- [ ] T3.6 [M] HD-7.1 Enforce layering with ESLint or an import-boundary check: components must not import `lib/api`, `lib/services` or `fetch`; services must not import hooks or components; only `lib/api/server.ts` imports `next/headers` for data
- [ ] T3.7 [M] HD-7.2 Enforce naming with `no-restricted-imports`: `use-*.ts` never imports `@tanstack/react-query` (extends `BaseQuery`); query keys only in `lib/query/keys.ts`; services are `<Resource>Service` classes extending `BaseService`
- [ ] T3.8 [M] HD-7.4 One contract for every endpoint (OpenAPI or shared Zod schemas) used by `src/api` and the services; list error codes and the paging `meta` shape
- [ ] T3.9 [M] HD-7.5 Auth endpoints `POST /auth/login`, `/auth/refresh`, `/auth/logout`; move 401, refresh, retry into `ApiClient` (skip if T0.2 chooses the cookie model)
- [ ] T3.10 [M] HD-7.11 Global `QueryClient` defaults plus error boundary: failed query shows a defined message with retry; 401 signs out with return path; 403 shows the forbidden view
- [ ] T3.11 [M] HD-2.4 Central handler for 401 (clear state, redirect to sign-in with return path) and 403 (forbidden view); share with T3.10
- [ ] T3.12 [M] HD-2.5 Document the session seam (`getSession`, the proxy, sign-in and sign-out actions) with one provider example; refuse the mock cookie when `NODE_ENV` is production
- [ ] T3.13 [S] HD-2.8 Active role switching for users with several roles in an organization; menus and checks follow it
- [ ] T3.14 [S] HD-7.3 Check one instance per service and one client for both environments; cacheable requests carry no cookies (delete the server branch if the host stays client-only)
- [ ] T3.15 [S] HD-7.6 Every mutation hook declares its cache effect (optimistic with rollback, or invalidate)
- [ ] T3.16 [S] HD-7.7 One query-string convention (`page`, `pageSize`, `q`, `status`, `sort`) and one `meta`; list hooks keep previous page and debounce text
- [ ] T3.17 [S] HD-7.8 Prefetch only first-paint data in layouts (`commonMenu`, active organization menu) with the same key and service call as the hook

## Phase 4: State management (SRS 2.8)
- [ ] T4.1 [M] HD-8.2 Sign-out clears query cache and stores; organization switch keeps organization-independent queries (`commonMenu`, `profile`)
- [ ] T4.2 [M] HD-8.5 Hydration safety audit: stored theme, font size, collapsed flag, locale come from a cookie or a head script; no layout-changing `useEffect` after mount
- [ ] T4.3 [S] HD-8.3 Set and document query defaults once (`staleTime`, retry, refetch on focus only for session and notifications)
- [ ] T4.4 [S] HD-8.4 Typed selectors everywhere; no component subscribes to a whole store
- [ ] T4.5 [S] HD-8.1 README state inventory table (state, owner, rule)
- [ ] T4.6 [C] HD-8.7 TanStack Query Devtools in development only; document how to inspect stores

## Phase 5: Shell edge cases (SRS 2.3)
- [ ] T5.1 [M] HD-3.1 Stress data: 300+ menu items, 5 levels, 50+ organizations, very long names, user with zero organizations (empty state, no crash)
- [ ] T5.2 [M] HD-3.2 Menu load failure: sidebar error with retry, rest of shell usable (with T3.5)
- [ ] T5.3 [S] HD-3.3 Header search: command palette (`Ctrl+K`, menu as first source) or remove it (per T0.9)
- [ ] T5.4 [S] HD-3.4 `loading.tsx`, `error.tsx`, `not-found.tsx` in every route group using the shell; whole-shell first-load skeleton
- [ ] T5.5 [C] HD-3.5 Keyboard shortcuts (toggle sidebar, search, notifications) with tooltip hints and an off switch
- [ ] T5.6 [M] HD-6.14 Keep shell-less routes (`/print/*`, public display screens) free of shell, sidebar and header

## Phase 6: Production readiness (SRS 2.5)
- [ ] T6.1 [M] HD-5.2 Content-Security-Policy and security headers; cookies `httpOnly`, `secure`, `sameSite` in production; server actions check the session
- [ ] T6.2 [S] HD-5.6 CI workflow running `npm run check` and the browser script on each pull request
- [ ] T6.3 [S] HD-5.1 Measure bundle per route; lazy-load notifications panel and display settings if worthwhile; record numbers
- [ ] T6.4 [S] HD-5.4 Check plural and number rules in both languages; document and test the add-a-language procedure; check RTL
- [ ] T6.5 [S] HD-5.5 SEO: Open Graph image, structured data on organization profiles, custom 404, canonical URL on public pages
- [ ] T6.6 [C] HD-5.7 Single error-reporting hook for client and server errors

## Phase 7: Alignment with the host (SRS 2.6, 2.7), after Phase 0 decisions
- [ ] T7.1 [M] HD-6.6, HD-7.10 Map `lib/services` and hooks onto the host's layering; keep service and method names; decide classes vs the host's function style
- [ ] T7.2 [M] HD-6.7 Reuse the host `apiClient`; add only the global 401-to-sign-out handler and a typed 403
- [ ] T7.3 [M] HD-6.8 Map menu schema to `@rxprofile/types`; public UUIDv7 IDs and slugs in URLs
- [ ] T7.4 [M] HD-6.9 Trailing slash, `NEXT_PUBLIC_BASE_PATH`, `BASE_PATH` for assets, `preferenceKey()` for storage and cookie keys
- [ ] T7.5 [M] HD-6.10 Register each copied page: `PermissionId`, `routes.manifest.ts`, `features.ts`; decide whether the landing page replaces, extends or is dropped
- [ ] T7.6 [S] HD-6.11 Move legal text to the host's Markdown content; keep only the table-of-contents layout component
- [ ] T7.7 [S] HD-6.12 Display settings use the host providers; keep UI and content language separate; replace post-mount font-size effect with a head-script data attribute
- [ ] T7.8 [S] HD-6.13 Wire notifications to `services/notify` and the notifications endpoint when they exist; `ReportNotifications` becomes one kind
- [ ] T7.9 [C] HD-6.16 Decide the place for "acting as" (linked patients, family) or keep it in settings
- [ ] T7.10 [S] HD-6.19 Document the shell in the host's `apps/web/CLAUDE.md` and `src/app/README.md`; fix stale README sections

## Acceptance (SRS section 4)
- [ ] A1 `npm run check` passes; browser script clean across all routes, 3 widths, 8 styles, 2 modes
- [ ] A2 App runs against the mock and a stub HTTP server with no component changes
- [ ] A3 Fresh copy plus README checklist plus demo deletion builds and signs in with another data source
- [ ] A4 No file outside the config module contains the product name or demo emails
- [ ] A5 Any new component, hook or service traces through the section 2.7 layers; `src/api` removable by changing `NEXT_PUBLIC_API_BASE_URL` and service bodies
- [ ] A6 Section 2.6 decisions written in the host docs; no copied file uses a second i18n system, authorization model, API client or router convention
- [ ] A7 Failed menu request, expired session and zero organizations each show a defined screen
