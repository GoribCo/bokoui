# next-js-layouts

A generic application shell built with Next.js 16 (App Router) and `bokoui/react`: left sidebar with organization switcher and role-aware menus, header, footer, mobile bottom navigation and drawer, appearance controls (mode, style, language), SEO helpers and public organization profiles. All data is mock data behind service interfaces, so the shell can be copied into another project and wired to a real API.

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
  app/
    layout.tsx            root: html lang, fonts, ThemeScript, AppProviders
    (auth)/               sign-in (no shell)
    (dashboard)/          pages inside the shell; layout.tsx checks the session and builds the shell
    (public)/             pages anyone can open: organization profiles, legal, help
  components/             layout/ navigation/ organization/ account/ appearance/ (presentational, typed props)
  config/                 site, common menu, account menu, organization types, navigation, features
  services/               interfaces (types.ts), mock implementations (mock/), one registry (index.ts)
  stores/ providers/      Zustand stores (UI, active organization), React providers
  hooks/ lib/             hooks, menu and access helpers, SEO, fonts, formatting
  schemas/ types/ i18n/   Zod schemas, types, locale config and message catalogs
```

State follows SRS section 3.9: server data through Server Components and TanStack Query, UI state in Zustand (the collapsed sidebar and active organization are also written to cookies so the server renders them correctly on first paint), URL state with nuqs, forms with React Hook Form and Zod.

## Replace the mock data with a real API

1. Implement the interfaces in `src/services/types.ts` (`SessionService`, `OrganizationService`, `MenuService`, `ProfileService`) with calls to your API. Validate responses with the schemas in `src/schemas/`.
2. Point `src/services/index.ts` at the new implementation. That is the only place that changes; no component imports mock data.
3. Replace the mock session cookie: `SESSION_COOKIE` in `src/config/auth.ts`, the `signIn` and `signOut` actions in `src/lib/auth/actions.ts`, and the sign-in page.
4. Replace `src/config/site.ts`, `common-menu.ts` and `account-menu.ts` with your values, or load them from the API.

## Common changes

**Add a page.** Create `src/app/(dashboard)/my-page/page.tsx`, export `metadata = buildMetadata({ title, description, path })` and render `PageContainer` and `PageHeader`. No shell change is needed. Public pages go under `(public)`; add their URL prefix to `PUBLIC_PATH_PREFIXES` in `src/config/auth.ts`.

**Add a menu item.** Menus are data: add an entry to the organization's menu (`src/services/mock/menus.ts`, or your API) with `id`, `label`, optional `labelKey`, `icon`, `href`, `children`, `badge` and `requiredRoles`. Ids must be unique within a menu. Icons are names in the registry `src/components/navigation/menu-icons.ts`; add a Lucide icon there to use it.

**Restrict a page by role.** Check on the server, as `(dashboard)/admin/page.tsx` does: `can(await getActiveRoles(), "admin.access")`, then call `forbidden()`. Add permissions to `src/lib/access/policy.ts`. Hiding the menu item is not protection.

**Add an organization type.** Add an entry to `src/config/organization-types.ts`, a member to `OrganizationDetails` in `src/types/organization.ts` with its profile section in `components/organization/public-profile.tsx`, and a folder `src/app/(public)/{segment}/[slug]/page.tsx` (copy an existing one). Add `organizationType.{key}` to the message catalogs.

**Add a language.** Add the code to `locales` in `src/i18n/config.ts`, a catalog `src/i18n/messages/{code}.json` (same keys as `en.json`), one loader in `src/i18n/messages.ts`, and `locale.{code}` to every catalog. For a script that needs its own font, register it in `src/lib/fonts.ts` and map it in `src/styles/typography.css`.

**Change fonts or the type scale.** Fonts: `src/lib/fonts.ts` (families) and `src/styles/typography.css` (mapping and scale tokens). The optional header font picker is off by default; set `features.fontSwitcher` in `src/config/features.ts`.

**Change the bottom navigation.** `bottomNavSlots` in `src/config/navigation.ts` sets how many slots the bar has, counting "More".

## Notes

- Public organization profiles are fetched on demand and cached for an hour with `unstable_cache` (`src/lib/public-organization.ts`). The app does not use Cache Components, because the root layout reads cookies (locale, sidebar state).
- `forbidden()` needs `experimental.authInterrupts` in `next.config.ts`; it is experimental in this Next.js version.
- Jotai and Redux Toolkit are deliberately not installed (SRS FR-9.6).
