# Task List: Generic Application Layout (Next.js)

Based on: [SRS](../srs/srs-layouts.md)
Legend: `[ ]` todo, `[x]` done. Requirement IDs refer to the SRS.

Working rules for this stage:
- Implement one task at a time, in order; tick the checkbox when the task is finished.
- No tests and no verification steps at this stage; the owner tests manually and writes tests later. Each task is still implemented completely (no stubs or TODOs), and code must be type-correct and lint-clean as written.
- All code lives in `examples/next-js-layouts/` (Next.js 16, App Router, `src/`). Read the relevant guide in `node_modules/next/dist/docs/` before Next-specific code.
- UI comes from `bokoui/react`; no hard-coded colors; strict TypeScript, no `any`; every component takes typed props.
- All data is mock data behind service interfaces (SRS 2.1).

## Phase 0: Project setup (SRS 1.4, 2.3)
- [ ] T0.1 Read the Next.js 16 docs in `node_modules/next/dist/docs/` (App Router, route groups, metadata, proxy, `next/font`, cookies) after the project is created
- [ ] T0.2 Create `examples/next-js-layouts/` (Next.js, TypeScript strict, `src/` dir, App Router, ESLint, Tailwind v4), modelled on `examples/next-js/` config; add `.npmrc` pointing at local Verdaccio
- [ ] T0.3 Install `bokoui` from Verdaccio and wire `bokoui/styles.css` into global CSS; add `ThemeScript` to `<head>` and the bokoui theme provider to the root layout
- [ ] T0.4 Install dependencies: `zustand`, `@tanstack/react-query`, `nuqs`, `react-hook-form`, `zod`, `@hookform/resolvers`, `next-intl` (no Jotai, no Redux Toolkit; FR-9.6)
- [ ] T0.5 Create the folder structure from SRS section 5 (`components/*`, `config`, `lib`, `services`, `hooks`, `stores`, `providers`, `schemas`, `types`, `i18n`)
- [ ] T0.6 Configure `@/*` alias, `npm run dev|build|lint|typecheck` scripts, `.gitignore`, and a short `README.md` for the project

## Phase 1: Types and data contracts (FR-1.4, FR-4.1, FR-10.3)
- [ ] T1.1 Define types in `src/types/`: `MenuItem` (id, label/labelKey, icon, href, children, badge, requiredRoles), `MenuGroup`, `Role`, `Organization` (id, slug, name, logo, type, roles), `OrganizationType`, `User`, `Session`, `FooterLink`, `SiteConfig`, `LocaleCode`
- [ ] T1.2 Define Zod schemas in `src/schemas/` mirroring the session, organization and menu shapes (FR-9.5)
- [ ] T1.3 Define service interfaces in `src/services/` (`SessionService`, `OrganizationService`, `MenuService`, `ProfileService`) returning typed promises
- [ ] T1.4 Implement mock services with realistic data: one user with multiple roles, three organizations of different types with different roles and different menus, a large menu (hundreds of items, five levels deep) for one organization, common menu, footer links
- [ ] T1.5 Add one service registry module (`src/services/index.ts`) so mocks are swapped for API-backed services in one place (NFR-6)

## Phase 2: Foundations (FR-11, FR-12, FR-13)
- [ ] T2.1 Typography: register fonts in `src/lib/fonts.ts` via `next/font` (Latin and Bangla, e.g. Noto Sans Bengali), expose CSS variables, define the type scale through tokens, use bokoui Heading/Text (FR-12.1, FR-12.2, FR-13.7)
- [ ] T2.2 i18n: configure next-intl with cookie-based locale (no URL prefix), a single locale config (`en` default, `bn`), request config, and message catalogs `en.json` and `bn.json` for all shell text (FR-13.1, FR-13.2, FR-13.4 to FR-13.6)
- [ ] T2.3 Locale switching: server action that sets the locale cookie; locale-aware date/number formatting helpers
- [ ] T2.4 SEO helper in `src/lib/seo/`: `buildMetadata(props)` with site-wide defaults, title template, Open Graph, canonical, `noindex` option (FR-11.2, FR-11.5)
- [ ] T2.5 Root layout: `lang` from locale, viewport and theme color, fonts, providers wiring point (FR-11.3)
- [ ] T2.6 `robots.ts` and `sitemap.ts` (FR-11.3)
- [ ] T2.7 Access helpers in `src/lib/access/`: `hasRole`, `hasAnyRole`, `can`, effective-roles-for-organization (union of roles), all pure (FR-10.1, FR-10.5)
- [ ] T2.8 Menu helpers in `src/lib/menu/`: filter by roles (hide groups with no allowed children), find active item and parent chain, flatten, label resolution through i18n (FR-4.3, FR-2.4, FR-4.6)

## Phase 3: State and providers (FR-9, FR-3.5)
- [ ] T3.1 `QueryProvider` with a shared `QueryClient` (FR-9.2)
- [ ] T3.2 Zustand UI store: sidebar collapsed (persisted), mobile drawer open, bottom-nav "More" open; typed selectors (FR-9.3, FR-2.3)
- [ ] T3.3 Zustand organization store: active organization id (persisted, restored on load) and `setActiveOrganization` (FR-3.4, FR-3.6)
- [ ] T3.4 `SessionProvider` and `useSession` hook exposing typed session (user, organizations, roles per organization) (FR-10.3)
- [ ] T3.5 `useActiveOrganization` hook combining session and organization store; `useMenu` hook returning the role-filtered menu for the active organization (FR-3.5, FR-4.3)
- [ ] T3.6 TanStack Query hooks for client-side data (`useMenuQuery`, `useOrganizationsQuery`) using the service registry
- [ ] T3.7 Add `NuqsAdapter` for Next.js App Router and a small example of a typed search-param hook in `src/hooks/` (FR-9.4)
- [ ] T3.8 Compose all providers in one `AppProviders` component used by the root layout
- [ ] T3.9 Prevent layout shift when restoring sidebar and organization state (hydration-safe persisted stores, server-read cookie for initial collapsed value) (NFR-2)

## Phase 4: Shell components (FR-1, FR-2)
- [ ] T4.1 Layout primitives in `components/layout/`: `AppShell` (sidebar, header, main, footer slots; independent scroll areas), `PageContainer`, `PageHeader` (h1, description, actions) (FR-1.1, FR-1.2, FR-11.6)
- [ ] T4.2 `MenuItemLink`, `MenuGroupSection`, `MenuTree` in `components/navigation/`: unbounded depth, collapsible groups, long-label truncation with tooltip, `aria-current`, `aria-expanded`, keyboard operable, auto-expand active parents (FR-2.2, FR-2.4, FR-2.5, FR-4.2)
- [ ] T4.3 `Sidebar`: four sections (org switcher, scrollable navigation, common menu, account area), expanded and icon-only collapsed rail, collapse toggle, tooltips when collapsed, smooth width transition respecting reduced motion (FR-2.1, FR-2.3)
- [ ] T4.4 `OrganizationSwitcher`: current org name/logo, dropdown with scrollable list and search, single-org behavior, switching updates store and menu, works in collapsed rail (FR-3.1 to FR-3.3)
- [ ] T4.5 `CommonMenu`: standard bottom items (Terms, Help, Privacy settings, ...) from `config`, independent of organization (FR-4.5)
- [ ] T4.6 Account area: `UserAvatar` (photo with initials fallback), `AccountMenu` (name, email, Manage account, View profile, Logout via injected handler, other standard items), avatar-only when collapsed (FR-5.1 to FR-5.4)
- [ ] T4.7 `Footer`: configurable links, copyright, optional reuse of the menu model, never hidden behind bottom nav (FR-8.1 to FR-8.3)

## Phase 5: Header and appearance (FR-7)
- [ ] T5.1 `Header` with slots: hamburger (mobile), branding (logo, product name), breadcrumbs, search, notifications, actions (FR-7.1, FR-7.3)
- [ ] T5.2 `ThemeModeToggle` (light/dark/system) and `StyleSwitcher` (8 bokoui styles) using the bokoui theme hooks (FR-7.2, FR-7.4)
- [ ] T5.3 `LanguageSwitcher` (English, Bangla) wired to the locale server action (FR-7.2, FR-13.1)
- [ ] T5.4 Optional `FontSwitcher` using the font registry, behind a config flag (FR-12.3)
- [ ] T5.5 `AppearanceMenu` grouping the controls: inline on desktop, compact popover on mobile (FR-7.5)
- [ ] T5.6 Breadcrumbs component driven by the menu parent chain (FR-7.3)

## Phase 6: Mobile navigation (FR-6)
- [ ] T6.1 `BottomNav`: top-level items, configurable visible slot count, overflow into a "More" sheet, safe-area padding, active state (FR-6.1, FR-6.5, FR-6.7)
- [ ] T6.2 `SubMenuSheet`: opens above the bottom bar for items with children; supports nested groups (FR-6.2)
- [ ] T6.3 `MobileDrawer` opened by the header hamburger: full navigation, org switcher, common menu, account area; focus trap, Escape to close, closes on navigation (FR-6.3)
- [ ] T6.4 Responsive switching in `AppShell`: sidebar on desktop, bottom nav plus drawer on mobile, continuous behavior across tablet widths, no horizontal scroll, content area reserves space for bottom nav (FR-6.4, FR-6.5, FR-8.3)
- [ ] T6.5 Config value for bottom-nav slot count in `config/` and passed as a prop (FR-6.7)

## Phase 7: Routing and pages (FR-1.3, FR-3.7 to FR-3.9, FR-10.4, FR-10.6, FR-11)
- [ ] T7.1 Route groups: `(auth)` (sign-in), `(dashboard)` (shell pages), `(public)` (organization profiles); each with its own `layout.tsx`
- [ ] T7.2 `(dashboard)/layout.tsx`: fetch session and menus in a Server Component, pass them as props to `AppShell`, server-side session check that redirects when unauthenticated
- [ ] T7.3 Proxy (Next.js 16 proxy file): optimistic redirect of unauthenticated users to sign-in via session cookie; exclude `(public)` routes, static assets and API routes (FR-10.6)
- [ ] T7.4 Mock sign-in page with React Hook Form + Zod, sets a mock session cookie; logout handler clears it (FR-9.5, FR-5.3)
- [ ] T7.5 Dashboard home page and several sample pages exercising the shell (a table page, a form page, a long-scroll page, a page using nuqs filters/tabs/pagination), each with metadata through `buildMetadata` (FR-1.2, FR-9.4, FR-11.1)
- [ ] T7.6 Role-restricted sample page with server-side role check and a forbidden/not-authorized view (FR-10.4)
- [ ] T7.7 Organization type registry (`config/organization-types.ts`: type key, URL segment, label, icon) (FR-3.8)
- [ ] T7.8 Public profile routes `(public)/hospital/[slug]`, `(public)/pharmacy/[slug]`, `(public)/company/[slug]` built from the registry, rendered on demand with caching, `generateMetadata`, `notFound()` for unknown slugs, per-type profile sections (FR-3.7, FR-3.9, FR-11.4)
- [ ] T7.9 Global `not-found.tsx`, `error.tsx` and `loading.tsx` pages using bokoui components; `noindex` default for `(dashboard)` and `(auth)` (FR-11.5)

## Phase 8: Wrap-up
- [ ] T8.1 Wire `run.sh` and the root docs: add `examples/next-js-layouts/` to the example list (next free port) and to the repo layout notes in `CLAUDE.md`
- [ ] T8.2 Write `examples/next-js-layouts/README.md`: how to replace mock services and config with real API data, how to add a page, a menu item, an organization type and a language
- [ ] T8.3 Run `npm run lint` and `npm run typecheck` once and fix errors (no other verification at this stage)
- [ ] T8.4 Update this task list and add a layout entry to `docs/component-status.md`

## Deferred (after manual testing)
- Unit tests for menu filtering, access helpers, stores
- Browser and accessibility verification at mobile, tablet and desktop widths with all styles and modes
- Acceptance criteria walk-through (SRS section 6)
