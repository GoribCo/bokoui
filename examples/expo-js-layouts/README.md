# bokoui Expo layouts

The generic application shell (drawer, bottom navigation, sidebar on wide screens, organization and role switching, notifications, display settings, English and Bangla) built on `bokoui/expo` and Expo Router. It is the mobile port of [next-js-layouts](../next-js-layouts); all data is sample data behind the same service interfaces. Task list: [tasks-layouts-expo](../../docs/tasks/tasks-layouts-expo.md).

## Run

```bash
npm install
npm run dev          # Metro on :3004 (or $PORT); press w for web, i for iOS, a for Android
npm run lint
npm run typecheck
```

`bokoui` comes from the registry in `.npmrc` (local Verdaccio). From the repo root, `./run.sh` publishes the library and runs every example.

Sign in with any email and password; the sign-in screen lists three sample accounts (several organizations and roles, no organization, sixty organizations).

## Structure

- `src/app`: routes only. `(public)` (landing, public profiles `/[type]/[slug]`, help, contact, legal), `(auth)` (sign-in), `(app)` (the shell; its layout guards the session).
- `src/components`: presentational components by area (`layout`, `navigation`, `organization`, `account`, `appearance`, `auth`, `examples`). `layout/dashboard-shell.tsx` is the one connected component.
- `src/hooks`: `use-<resource>` data hooks (a class extending `BaseQuery`, the only importer of TanStack Query) and UI hooks.
- `src/providers`: `AppProviders` (theme, query, session, toast; holds the splash screen until fonts, stores, language, theme and session are ready).
- `src/api`: the in-process sample API. `src/lib`: `contract` (the single API description), `services`, `api` (client and transports), `schemas`, `stores` (Zustand, persisted to AsyncStorage), `config`, `i18n`, `menu`, `access`, `authorization`.

Data flows one way: component, hook, service, `ApiClient`, API. Components never import `lib/services` or `lib/api`.

## Replace the sample API

1. Set `EXPO_PUBLIC_API_BASE_URL` (for example `https://api.example.com/v1`). `ApiClient` then uses real `fetch` instead of the in-process transport (`lib/api/instance.ts`).
2. Implement the endpoints of `src/lib/contract/index.ts`, or change the contract first. Answers use `{ success, results, meta }`; login returns the user and a `tokens` pair, `/auth/refresh` takes `{ refreshToken }`. The client sends `Authorization: Bearer`, refreshes once on a 401 and retries.
3. Delete `src/api` and the `sampleTransport` import in `lib/api/instance.ts`.

Tokens are kept in `expo-secure-store` on devices and in AsyncStorage on the web build.

## Add things

- **A screen:** a file under `src/app/(app)/`; call `useScreenTitle(title)`; build it from `PageContainer` and `PageHeader`.
- **A menu item:** add it to the organization's menu in `src/api/data/menus.ts` (or your API). `icon` is a name in `components/navigation/menu-icons.ts`; `labelKey` is a key in the catalogs; `requiredRoles` and `requiredPermissions` filter it. The UI shows groups plus one nested level.
- **An organization type:** one entry in `lib/config/organization-types.ts`, one member of `OrganizationDetails` (`lib/types/organization.ts`, its schema, and a case in `components/organization/public-profile.tsx`). Its public route `/{segment}/{slug}` needs no new file.
- **A language:** add the code to `lib/i18n/config.ts`, a catalog `lib/i18n/messages/<code>.json` and an entry in `lib/i18n/messages.ts`. The display settings sheet lists it by itself.
