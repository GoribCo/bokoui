# Task List: Generic Application Layout (Expo / mobile)

Based on: [SRS (Next.js)](../srs/srs-layouts.md), [Next.js task list](tasks-layouts.md) and the finished app `examples/next-js-layouts/`.
Legend: `[ ]` todo, `[x]` done. Status suffix on each task: `-IP` in progress, `-DONE` finished (kept as history). Requirement IDs (FR-x.y) refer to the Next.js SRS; section 2 says what each one becomes on mobile.

Working rules for this stage:
- Implement one task at a time, in order; tick the checkbox when the task is finished.
- No new test files (owner decision, as in `tasks-layouts-hardening.md`). Each task is implemented completely (no stubs, no TODOs); code is strict-TypeScript (`no any`) and lint-clean as written. Verification is ad hoc and happens once, in Phase 8.
- All code lives in `examples/expo-js-layouts/` (Expo SDK 57, expo-router, `src/`). Before touching an Expo, expo-router or React Native API, read the matching docs for the installed SDK (`examples/expo-js-layouts/AGENTS.md`); do not write from memory.
- UI comes from `bokoui/expo`; colors come from `useTheme().tokens`, never hard-coded. Icons come from `lucide-react-native` (bokoui has no Icon on Expo).
- All data is sample data behind the same service interfaces as the web app (see 1.4).

## 1. Review of `examples/next-js-layouts` (what we are porting)

### 1.1 Features
Sidebar (organization switcher, role switcher, role-filtered menu, common menu, account area, collapsible rail), header (page title, search, notifications panel, display settings: mode, style, font size, language), footer, mobile bottom navigation with a "More" sheet and sub-menu sheet, mobile drawer, public landing page and public organization profiles by type, sign-in with httpOnly JWT cookies and refresh, role-restricted pages (403 view), 404/error/loading pages, sample pages (table, form, filters, long page), English and Bangla, SEO helpers, and a permission evaluator.

### 1.2 Architecture
One-way data flow: **component, then hook, then service, then `ApiClient`, then the API**. Components never fetch.
- `lib/contract`: the single description of the API (method, path, request and response Zod schemas, error codes, paging). The sample backend and the services both read it.
- `lib/services/<resource>.service.ts`: classes extending `BaseService`, validated answers, shared instances exported from `lib/services/index.ts`.
- `hooks/use-<resource>.ts`: a class extending `BaseQuery` (the only importer of TanStack Query), exported as a plain hook; keys only in `lib/query/keys.ts`.
- State, one owner each: server data in TanStack Query, UI state in Zustand (collapsed sidebar, drawer, active organization, active role; persisted), shareable view state in the URL (nuqs), forms in React Hook Form + Zod.
- Pure logic in `lib/`: `access`, `authorization` (permission evaluator), `menu` (filter by roles and permissions, active trail, flatten, localize), `config` (site, features, navigation, menus, auth, organization types), `i18n`, `schemas`, `types`.
- Presentational components in `components/<area>/` with typed props, built from data passed in; one connected component (`dashboard-shell.tsx`) wires hooks to them.
- Provider composition in one `AppProviders`; session expiry handled once (`session-expiry`); every error goes through `reportError`.

### 1.3 Naming conventions to keep
kebab-case file names (`account-menu.tsx`, `use-notifications.ts`, `menu.service.ts`); `@/*` is `./src/*`; `use<Resource>` reads and `use<Verb><Resource>` changes; `<Name>Service` classes and `<name>Service` instances; `<Name>Query extends BaseQuery`; `queryKeys.<name>`; store factories `create<Name>Store` with `<name>Selectors`; config values are named constants or plain objects in `lib/config/`; tests (none here) would sit next to the code as `*.test.ts`; components are named functions with an exported `<Name>Props` interface; menu labels carry a `labelKey` plus a fallback `label`.

### 1.4 What the Expo app does differently, and why
| Web | Expo | Reason |
|---|---|---|
| Next.js route groups, proxy, Server Components | expo-router file routes with groups `(public)`, `(auth)`, `(app)`; guards with `Stack.Protected` or `Redirect` | No server render or proxy on mobile |
| Sample API served at `/api/v1` by the app | Sample API runs in-process behind a transport interface; `EXPO_PUBLIC_API_BASE_URL` switches `ApiClient` to real `fetch` | No server in an Expo app; services stay identical |
| httpOnly cookies (JWT pair) | Tokens in `expo-secure-store` (native) or AsyncStorage (web build); same login/refresh/logout contract and the same retry-once-on-401 flow | Cookies are not the mobile norm |
| Cookie persisted stores, server-read initial state | Zustand `persist` with AsyncStorage; the splash screen is held until stores are rehydrated, so no wrong first frame | No server to seed state |
| next-intl, cookie locale | `i18next` + `react-i18next` + `expo-localization`, same message catalogs and keys (`en.json`, `bn.json`), locale in AsyncStorage | next-intl is Next-only |
| `next/font` | `expo-font` / `@expo-google-fonts` (Noto Sans Bengali for `bn`) | |
| nuqs URL state | expo-router search params (`useLocalSearchParams`, `router.setParams`) | |
| SEO, metadata, robots, sitemap, Open Graph | Dropped, except screen titles and the web build's document title | Not applicable to apps |
| Desktop sidebar, collapsible rail | Phone: bottom navigation + left drawer. Width of 768 or more (tablet, web build): permanent bokoui `Sidebar` with a collapse toggle | Continuous behavior across widths |
| Keyboard shortcuts, hover tooltips | Dropped (long-press `Tooltip` only where it helps) | Touch device |
| Breadcrumbs, five-level menu tree | Dropped. Menus show groups and one nested level (accordion in the drawer, sheet from the bottom bar) | Owner decision: no deep multi-level navigation |
| Font size control | Dropped; the OS text size applies | React Native scales text itself |

Framework-neutral modules are copied from `examples/next-js-layouts/src/lib` with the same paths and names (types, schemas, contract, access, authorization, menu, config, i18n catalogs, mock data) so the two apps stay easy to diff. Next-only parts (`cookie-storage`, `next-intl` wiring, `seo`, `proxy`, server actions) are not copied. Moving the shared modules into a package is out of scope.

## 2. Requirement mapping
| SRS group | On mobile |
|---|---|
| FR-1 Layout structure | Kept: shell with header, content, footer; content scrolls on its own; pages live in the `(app)` group (FR-1.3); typed props (FR-1.4) |
| FR-2 Sidebar | Kept for width 768 or more (sections, groups, active route, collapse, persisted); phone uses the drawer with the same sections |
| FR-3 Organization switcher | Kept (list with search above 6 items, single-org behavior, persisted last choice, one typed hook); public profiles by type (FR-3.7 to 3.9) kept as `(public)/[type]/[slug]` |
| FR-4 Menus | Kept: data-driven, per organization, filtered by roles and permissions, common menu, `labelKey` translation; unbounded depth stays in the model, the UI shows two levels |
| FR-5 Account | Kept: avatar with initials, account sheet (Manage account, View profile, Sign out via injected handler) |
| FR-6 Responsive | Bottom navigation with slot count config, "More" sheet, sub-menu sheet above the bar, safe areas, left drawer from the hamburger |
| FR-7 Header | Branding and title, notifications, display settings (mode, style, language); search optional |
| FR-8 Footer | Kept: configurable links and copyright at the end of scrolling content, never under the bottom bar |
| FR-9 State | Same tools; nuqs replaced by router params |
| FR-10 Access | Kept: roles, permission evaluator, role switcher, guard in the route group layout plus a forbidden view |
| FR-11 SEO | Dropped (screen titles only) |
| FR-12 Typography | Fonts via `expo-font`; scale from bokoui Heading and Text |
| FR-13 i18n | English and Bangla, one config list, same catalogs |
| NFR | Accessibility (roles, labels, 44 pt targets, reduce motion), all 8 styles and both modes, 390 pt phone and 768 and 1280 pt web, strict TypeScript, portability through services |

## Phase 0: Project setup
- [x] T0.1 Read the Expo SDK 57 docs for: expo-router (groups, `Stack.Protected`, `Tabs`, error boundaries, not-found, search params), `expo-secure-store`, `expo-localization`, `expo-font`, `expo-splash-screen`, safe area context
- [x] T0.2 Clean `examples/expo-js-layouts/` (currently a copy of `expo-js`): remove the demo screens (`display`, `feedback`, `forms`, `navigation`, `overlays`, `page-nav`, `pages`, `screen`, `platform-switcher`, `hint-row`, `animated-icon*`, `web-badge`, `external-link`, `themed-*`, `ui/collapsible`, `constants/theme`, `hooks/use-color-scheme*`, `hooks/use-theme`); keep `ThemeProvider` wiring, `custom-themes.ts` and the theme switcher logic for reuse
- [x] T0.3 Package setup: name `expo-js-layouts`, `bokoui` version matching the published one, `.npmrc` for the local registry, `app.json` name/slug/scheme, `@/*` alias in `tsconfig.json`, scripts `dev`, `lint`, `typecheck`, `build:pkg`, `publish:local` as in the other examples
- [x] T0.4 Install dependencies with `npx expo install` where an Expo version exists: `zustand`, `@tanstack/react-query`, `react-hook-form`, `zod`, `@hookform/resolvers`, `i18next`, `react-i18next`, `expo-localization`, `expo-secure-store`, `@expo-google-fonts/noto-sans-bengali`, `@react-native-async-storage/async-storage` (no Jotai, no Redux Toolkit, FR-9.6)
- [x] T0.5 Create the folder structure: `src/app` (routes only), `src/components/{layout,navigation,organization,account,appearance,auth,examples}`, `src/hooks`, `src/providers`, `src/api`, `src/styles`, `src/lib/{api,services,schemas,types,query,stores,config,i18n,access,authorization,menu,session,auth,monitoring,contract}`
- [x] T0.6 Short `README.md` (run, scripts, structure) and a port entry: `run.sh` runs this app on port 3004; `CLAUDE.md` repository layout and the examples list name it

## Phase 1: Types, contract and sample API
- [x] T1.1 Copy `lib/types`, `lib/schemas` and `lib/contract` (endpoints, errors, paging) from the web app, minus the demo-only `records` and `staff` endpoints; keep names and exports identical
- [x] T1.2 `lib/api/errors.ts` (`ApiError`, `isApiError`) and `lib/api/client.ts`: `ApiClient` with a pluggable transport (`fetch` transport and in-process transport), `{ success, results, meta }` envelope parsing, bearer token from token storage, one refresh and one retry on 401, a session-expired callback
- [x] T1.3 `lib/auth/token-storage.ts`: access and refresh tokens in `expo-secure-store` on native and AsyncStorage on web, one async interface
- [x] T1.4 Sample API in `src/api`: copy the data (one user with several roles, three organizations of different types, per-organization menus, common menu, a menu with a large number of items, notifications, profile, public organizations, a user with no organization and a user with many) and the endpoint handlers; a `router.ts` built from the contract; `auth.ts` issuing and checking sample tokens with expiry; a small artificial latency
- [x] T1.5 Services: copy `BaseService` and `session`, `menu`, `organization`, `profile`, `notification`, `search`, `auth` services; `lib/services/index.ts` exports the shared instances (the one place to swap mocks for a real API)

## Phase 2: Foundations
- [x] T2.1 Copy the pure modules unchanged: `lib/access`, `lib/authorization` (types, permissions, role templates, evaluate, from-session, assignments), `lib/menu` (active, filter, flatten, labels, footer-links) and `lib/config` (site without web-only fields, features, navigation with `bottomNavSlots`, common-menu, account-menu, auth, organization-types, search); adjust only paths and web-specific values (for example `DASHBOARD_PATH`)
- [x] T2.2 i18n: copy `en.json` and `bn.json` (drop the web-only keys), `lib/i18n/config.ts` (`locales`, `localeMeta`, `defaultLocale`), initialize `i18next` with `expo-localization` as the first-run default and AsyncStorage for the saved choice; a `useMenuTranslator` hook with the same API as the web app; locale-aware date and number helpers
- [x] T2.3 Fonts: register fonts in `lib/fonts.ts` (Latin system font, Noto Sans Bengali for `bn`) and load them through `expo-font`; one place defines the mapping (FR-12.1)
- [x] T2.4 Icon registry `components/navigation/menu-icons.ts` mapping `IconName` strings to `lucide-react-native` icons and `menu-icon.tsx` that renders them with theme token colors
- [x] T2.5 `lib/monitoring/report-error.ts` with `setErrorReporter`; wire the React Native global error handler and unhandled promise rejections to it

## Phase 3: State and providers
- [x] T3.1 `QueryProvider` with a shared `QueryClient`; connect TanStack's focus manager to `AppState` and the online manager to connectivity; copy `BaseQuery` and `lib/query/keys.ts` (without demo keys)
- [x] T3.2 Zustand stores with `persist` on AsyncStorage: UI store (drawer open, bottom-nav More open, sidebar collapsed for wide screens), organization store (active organization id), role store (active role); typed selectors as in the web app; a `hydrated` flag exposed for the splash gate
- [x] T3.3 `SessionProvider` and `useSession` (typed session), `useActiveOrganization` (session + stores, stale id falls back to the default), `useMenu` (role and permission filtered, localized)
- [x] T3.4 Data hooks built on `BaseQuery`: `use-session-query`, `use-organizations`, `use-organization-menu`, `use-common-menu`, `use-profile`, `use-notifications` (with optimistic mark-read), `use-search`, `use-auth` (`useLogin`, `useLogout`, `useSessionExpiry`)
- [x] T3.5 `AppProviders` composing: theme (bokoui `ThemeProvider` with AsyncStorage and custom themes), i18n, query, stores, toast; holds the splash screen until fonts, stores and the saved locale are ready (no flash, NFR-2)
- [x] T3.6 Session expiry handler: clears the query cache and stored organization and role, then goes to sign-in with a return target

## Phase 4: Shell components (presentational, typed props)
- [x] T4.1 `AppShell` (header slot, content, footer slot, bottom-nav slot, overlays slot) with safe-area insets, a scroll area that reserves space for the bottom bar; `PageContainer` and `PageHeader` (title, description, actions) built on bokoui layout primitives
- [x] T4.2 `Header`: hamburger (phone), branding or screen title, notifications button with unread badge, display-settings button; slots for optional search and actions
- [x] T4.3 `MenuItemLink` and `MenuGroupSection` (`components/navigation/`): group headings, one nested level as an accordion, active state, badges, long-label truncation, accessibility roles and state
- [x] T4.4 `BottomNav`: top-level items as slots, count from config, overflow into "More", active state, safe-area padding, 44 pt targets; `SubMenuSheet` opens a bokoui bottom `Drawer` for items with children
- [x] T4.5 `MobileDrawer`: bokoui `Drawer` from the left with organization switcher, role switcher, menu groups, common menu and account area; closes on navigation
- [x] T4.6 `OrganizationSwitcher`: current organization (name, type, logo or initials), bottom-sheet list with search above six organizations, single-organization behavior, "Manage workspaces" link; `RoleSwitcher` (all roles or one); `NoOrganizations` empty state
- [x] T4.7 Account area: `UserAvatar` (photo with initials fallback), `AccountMenu` sheet (name, email, Manage account, View profile, Sign out through an injected handler)
- [x] T4.8 `CommonMenu` (standard items from config, independent of organization) and `Footer` (configurable links, copyright, rendered at the end of the content)
- [x] T4.9 `NotificationsButton` and `NotificationList` (tabs for all, urgent and invitations, read state, empty state) in a bokoui `Modal` or `Drawer`
- [x] T4.10 Status views: `StatusView`, `ErrorView`, `NotFoundView`, `QueryError`, `ShellSkeleton` built from bokoui `EmptyState`, `Alert`, `Skeleton`

## Phase 5: Appearance
- [x] T5.1 `DisplaySettings` sheet opened from the header: mode (light, dark, system), design style (8 styles plus the custom one, behind `features.styleSwitcher`), language chips with flags; changes persist and apply at once
- [x] T5.2 First-launch defaults from `siteConfig.defaultStyle` and `defaultMode`; applied before the first frame through the provider's saved values and the splash gate

## Phase 6: Routing and screens
- [x] T6.1 Route groups with their own layouts: `(public)` (landing, public profiles, legal, help, contact), `(auth)` (sign-in), `(app)` (the shell); root layout with `AppProviders`, `StatusBar` by mode, and the stack
- [x] T6.2 Guards: signed-out users are sent to sign-in with a return target, signed-in users who open the landing page or sign-in go to the dashboard; the `(app)` layout checks the session, then renders `DashboardShell` (the one connected component that wires hooks to the presentational parts)
- [x] T6.3 Navigation wiring: `(app)` uses a layout that shows the bottom bar on phone width and the permanent `Sidebar` (collapsible, state persisted) from 768 wide; menu `href` values map to routes through one helper (`lib/menu/route.ts`)
- [x] T6.4 Sign-in screen: React Hook Form + Zod (`signInSchema`), `useLogin`, error message from `ApiError`, return to the target after success; sample accounts listed on the screen (normal, `empty@`, `many@`)
- [x] T6.5 Landing screen for visitors (hero, features, public organization list, call to action; English and Bangla)
- [x] T6.6 Public profile screens `(public)/[type]/[slug]` built from the organization type registry, per-type sections, not-found for an unknown slug or type
- [x] T6.7 Signed-in screens: dashboard, notifications, organizations list, profile, account (stub), settings/privacy (stub), each with a screen title
- [x] T6.8 Sample screens exercising the shell: table (bokoui `Table`, sortable), form (React Hook Form + Zod with bokoui `FormField`, `Select`, `Checkbox`, `DatePicker`), filters (search, tabs and paging kept in router params), long scrolling page
- [x] T6.9 Role-restricted screen (`admin`) with the permission check in its layout and a forbidden view for users without it
- [x] T6.10 Static content screens: help, contact, legal terms and privacy (template text from `lib/content/legal.ts`, copied)
- [x] T6.11 Root and group `+not-found` screens, an `ErrorBoundary` export per group wired to `reportError`, and loading states with skeletons

## Phase 7: Wide screens
- [x] T7.1 Tablet and web layout: `Sidebar` (organization switcher, menu groups, common menu, account) with the collapsed rail from bokoui `Sidebar`, header without the hamburger; one `useIsWide()` hook (768 breakpoint) decides between this and the phone layout, so resizing switches live without remounting state

## Phase 8: Wrap-up
- [x] T8.1 `README.md`: how to run, how to replace the sample API with a real one (`EXPO_PUBLIC_API_BASE_URL`, `lib/contract`, services), how to add a screen, a menu item, an organization type and a language
- [x] T8.2 `npm run lint` and `npm run typecheck` clean (run `npx expo install --check` and `npx expo-doctor` once)
- [x] T8.3 One ad hoc verification on the Expo web build in a real browser (puppeteer-core with axe on a cloned build, as in the other examples): 390, 768 and 1280 px, all 8 styles and both modes, English and Bangla, the flows of the acceptance list below. Run on a simulator or device when one is available; note what was not checked
  - *Done on the web build (390, 768, 1280; 8 styles x 2 modes with no contrast findings; English and Bangla; every route loads without console errors; org and role switching, forbidden view, notifications, search, display settings, sidebar collapse, sign-out, dead-token return to sign-in, live resize). **Not checked:** a device or simulator (safe areas, SecureStore, native Modal stacking, Hermes `Intl` for Bengali), mid-session token expiry (the in-memory token cache hides edits to storage), keyboard shortcuts (dropped). Remaining axe findings come from bokoui `Select` and `Table` (see component-status).*
- [x] T8.4 Update this task list, `docs/component-status.md` (Expo demos table) and any bokoui Expo gap found while building (record the gap, fix it in `packages/bokoui/src/expo` only when it blocks a requirement)

## Acceptance (adapted from SRS section 6)
1. The app opens on the landing screen; sign-in leads to the dashboard with header, content and footer; on phone width the bottom bar shows, from 768 wide the sidebar.
2. Switching organization changes the menu; a user with two roles sees the union; the role switcher narrows it to one role.
3. The last organization, role, style, mode and language survive an app restart with no wrong first frame.
4. Bottom bar sub menus open above the bar, overflow items sit under "More", the hamburger opens the full drawer, safe areas are respected, content is never covered.
5. A menu with several hundred items renders and scrolls without breaking layout (two levels shown).
6. Mode, style and language change from the header and persist.
7. Each state type uses its tool: query for server data, Zustand for UI state, router params for view state, React Hook Form + Zod for forms.
8. Replacing the sample API with a real one changes no component (components never import `lib/services`, `lib/api` or call `fetch`).
9. Role-restricted screen shows the forbidden view for users without the permission; an expired session returns to sign-in.
10. Lint and typecheck pass; verified in a real browser at three widths with an accessibility check.

## Open decisions (defaults used unless the owner says otherwise)
| # | Decision | Default |
|---|---|---|
| D1 | Share framework-neutral code with the web app | Copy with identical paths; no shared package |
| D2 | Sample API | In-process transport behind `ApiClient`; real `fetch` when `EXPO_PUBLIC_API_BASE_URL` is set |
| D3 | Token storage | `expo-secure-store` on native, AsyncStorage on web |
| D4 | i18n library | `i18next` + `react-i18next` + `expo-localization` |
| D5 | Wide-screen layout | Included (Phase 7); drop it if the app is phone-only |
| D6 | Menu depth shown | Groups plus one nested level |
