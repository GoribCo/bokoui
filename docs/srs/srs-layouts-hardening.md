# Software Requirements Specification: Layout Hardening Before Real Data

Extends: [srs-layouts.md](srs-layouts.md) (the shell itself) and [plan-layouts-reference-ui.md](../plan-layouts-reference-ui.md) (the reference UI alignment).
Version: 0.1 (draft) | Date: 2026-10-01

## 1. Introduction

### 1.1 Purpose
List the work to finish in `examples/next-js-layouts/` before it is copied into another project and wired to that project's real data. The shell and its mock data layer already exist. This document covers what is still unverified, what is still mock-only, and what makes the copy easy and safe.

### 1.2 Scope
In scope: verification, tests, the data and auth seams, edge cases of the shell, configuration for reuse, and production readiness. Out of scope: real business pages, the real API, and new bokoui components.

### 1.3 Priority
M = must do before copying, S = should do, C = could do. Items marked **First** are the recommended first three workstreams (section 2.1, 2.2 and 2.4).

### 1.4 Current state (baseline)
- Shell, switcher, header, display settings dropdown, notifications panel with tabs, landing page, and legal pages are built.
- Lint and typecheck pass. Spot checks with axe found no violations at 1280 px and 390 px, mostly in the flat style and light mode.
- Not yet checked: dark mode, tablet widths, Bangla, the other 7 styles (partly checked for two components), screen readers.
- No automated tests. Unit tests, browser checks and the acceptance walk-through are deferred in `tasks-layouts.md`.
- Data comes from `lib/services/mock`. The session is a cookie with the value `mock-session`.
- Stub pages exist for `/organizations`, `/notifications` and `/account`. Notification items are demo data in `lib/sample-data.ts`.

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
| HD-2.1 | A second, real-API implementation of the `services` interfaces (a `fetch`-based client with a configurable base URL) sits beside the mock, so the interfaces are proven against a real backend shape. A single setting selects mock or API | M |
| HD-2.2 | Every service response is validated with the Zod schemas in `lib/schemas`; TypeScript types are inferred from those schemas, so an API change shows as a type error | M |
| HD-2.3 | TanStack Query hooks expose loading, error and retry states. The shell shows a skeleton while the menu loads and an inline error with a retry button when it fails | M |
| HD-2.4 | A central handler treats 401 as an expired session (clear state, redirect to sign-in with a return path) and 403 as the forbidden view | M |
| HD-2.5 | The session seam is documented: where the real provider plugs in (`getSession`, the proxy, sign-in and sign-out actions), with an example for one provider. The mock cookie is never accepted when `NODE_ENV` is production | M |
| HD-2.6 | Notifications go through a service (list, mark read, mark all read) with read state kept on the server. The bell badge uses the unread count from that service | S |
| HD-2.7 | Optional live updates for notifications and the unread count (polling interval or a push hook), off by default | C |
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

## 3. Recommended order
1. **Verification first (2.1):** HD-1.1, HD-1.2, HD-1.5, HD-1.8. These make every later change safe.
2. **Reuse (2.4):** HD-4.1 to HD-4.3. Cheap, and removes the biggest copy-time risk.
3. **Data seam (2.2):** HD-2.1 to HD-2.5. Proves the shell against a real API shape and handles failures.
4. **Edge cases (2.3) and production readiness (2.5)** in parallel, then the remaining S and C items.

## 4. Acceptance criteria
1. `npm run check` passes, and the browser script reports no violations across all routes, 3 widths, 8 styles and 2 modes.
2. The app starts against the mock and against a stub HTTP server using the same interfaces, with no component changes.
3. A fresh copy of the folder, after following the README checklist and deleting the demo code, builds and signs in with a different data source.
4. No file outside the configuration module contains the product name or demo email addresses.
5. A failed menu request, an expired session and a user with no organizations each show a defined screen, not a blank page or a crash.

## 5. Open questions
1. Which auth provider will the host project use? That decides the example for HD-2.5.
2. Will the host project run a command palette (HD-3.3), or should search be removed?
3. Which languages beyond English and Bangla, and do any need right-to-left (HD-5.4)?
4. Is a monitoring service already chosen (HD-5.7)?
