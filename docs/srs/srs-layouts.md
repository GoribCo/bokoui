# Software Requirements Specification: Generic Application Layout (Next.js)

Source: [docs/new-plan-layouts.md](../new-plan-layouts.md)
Version: 0.1 (draft) | Date: 2026-09-30

## 1. Introduction

### 1.1 Purpose
Define the requirements for a generic, reusable web application shell (layout) that can host any large-scale project. The shell provides navigation, organization switching, role-aware menus, account management and appearance controls. It contains no real business content.

### 1.2 Scope
A Next.js project at `examples/next-js-layouts/` that implements the shell: left sidebar, header, footer, mobile navigation, and the state, SEO and typography foundations around them. All data (menus, organizations, roles, user, content) is mock data behind replaceable interfaces. The layout will later be copied into another project, where the mock data is replaced with API endpoints and JSON/TS definitions. Page content is out of scope.

### 1.3 Definitions
| Term | Meaning |
|---|---|
| Shell | The persistent layout around page content: sidebar, header, footer, mobile nav |
| Organization (org) | A tenant the user belongs to; drives which menu is shown |
| Role | A permission group; one user can hold several |
| Menu item | A node in the navigation tree (link or group with children) |
| Route group | A Next.js folder in parentheses, e.g. `(dashboard)`, which groups files without affecting the URL |
| Design style | A bokoui visual style (`data-theme`); mode (light/dark) is independent (`data-mode`) |

### 1.4 Technology baseline
- Next.js 16.x, App Router, `src/` directory. Next.js only; no other framework.
- React 19, TypeScript `strict`, no `any`.
- UI components from `bokoui/react`; Tailwind CSS v4 through bokoui tokens.
- Note: this Next.js version has breaking changes; consult `node_modules/next/dist/docs/` before writing Next-specific code.
- State management per section 3.9.

## 2. Overall Description

### 2.1 Product perspective
A template shell, not a finished product. It sits in `examples/` next to the other bokoui demos and imports the installed `bokoui` package (not relative paths). Its structure must be portable: data sources, permissions and content are injected through props and typed interfaces so the shell can be lifted into another project unchanged.

### 2.2 Users
- **Primary:** the project owner, reusing the shell in a larger project.
- **End users of that project:** people with one or more roles, belonging to one or more organizations.

### 2.3 Constraints
- Next.js App Router with `src/app` only.
- bokoui/react is the only UI component source.
- Design values come from bokoui tokens; no hard-coded colors.
- Standard coding practice and folder structure throughout.

### 2.4 Assumptions
- Authentication and real data come later; the shell works against mock providers with the same shape as the future API.
- Role and organization data are available to the shell after login as a typed session object.
- Content is not a concern now, but the layout must accept any type of content.

## 3. Functional Requirements

Priority: **M** = Must, **S** = Should, **C** = Could.

### 3.1 Layout structure
| ID | Requirement | Pri |
|---|---|---|
| FR-1.1 | The shell consists of a left sidebar, a header, a main content area and a footer | M |
| FR-1.2 | The main content area accepts any content (tables, forms, dashboards, long pages) without breaking the shell; it scrolls independently of the sidebar and header | M |
| FR-1.3 | Pages that share the shell live in a route group such as `(dashboard)`; other page families (e.g. auth, marketing) use their own groups and layouts | M |
| FR-1.4 | Shell components take their data and options through typed props, not hard-coded values or direct imports of mock data | M |
| FR-1.5 | Adding a new page, menu entry or content block requires no change to shell components | M |

### 3.2 Left sidebar
| ID | Requirement | Pri |
|---|---|---|
| FR-2.1 | The sidebar is divided into clear sections from top to bottom: organization switcher, main navigation, common menu, account area | M |
| FR-2.2 | The main navigation area is separated into labeled groups for easy scanning and scrolls on its own when it overflows | M |
| FR-2.3 | The sidebar is collapsible to an icon-only rail; collapsed state persists across reloads and shows tooltips for items | M |
| FR-2.4 | The active route is highlighted, and its parent groups are expanded automatically | M |
| FR-2.5 | Sidebar is fully keyboard operable and exposes correct ARIA landmarks and states (`nav`, `aria-current`, `aria-expanded`) | M |

### 3.3 Organization switcher
| ID | Requirement | Pri |
|---|---|---|
| FR-3.1 | The top of the sidebar shows the current organization (name, logo) and a control to switch to any organization the user belongs to | M |
| FR-3.2 | Switching organization replaces the main navigation with that organization's menu and updates the active organization in global state | M |
| FR-3.3 | The switcher handles many organizations (scrollable list, search) and a single organization (switching disabled or hidden) | S |
| FR-3.4 | The last active organization is remembered and restored | S |
| FR-3.5 | Organization context is available to pages and components through one typed hook/provider | M |

### 3.4 Menus and extensibility
| ID | Requirement | Pri |
|---|---|---|
| FR-4.1 | Menus are data-driven: a typed tree definition (id, label, icon, href, children, badge, required roles) rendered by generic components | M |
| FR-4.2 | Menu depth and item count are unbounded in the model; the UI stays intact with many items, long labels and deep nesting (truncation, scrolling, collapsible groups) | M |
| FR-4.3 | Menus are defined per organization and filtered by the user's roles; an item with no allowed children is hidden | M |
| FR-4.4 | Menu definitions can come from a TS/JSON file now and from an API later behind the same interface | M |
| FR-4.5 | Common bottom menu (Terms, Help, Privacy settings, and similar standard items) is configured separately from the organization menu and is the same across organizations | M |
| FR-4.6 | Menu labels support translation keys | S |

### 3.5 Account area
| ID | Requirement | Pri |
|---|---|---|
| FR-5.1 | The bottom of the sidebar shows the signed-in user's photo (with initials fallback), name and email | M |
| FR-5.2 | Selecting the account area opens a sub menu with Manage account, View profile, Logout and other standard entries | M |
| FR-5.3 | Logout calls an injected handler; the shell does not implement authentication | M |
| FR-5.4 | Collapsed sidebar shows the avatar only, with the same sub menu | M |

### 3.6 Responsive behavior
| ID | Requirement | Pri |
|---|---|---|
| FR-6.1 | Below the mobile breakpoint the sidebar is replaced by a bottom navigation bar | M |
| FR-6.2 | Bottom navigation shows the top-level items; items with children open their sub menu in a sheet/popover above the bar | M |
| FR-6.3 | On mobile, a hamburger button at the left of the header opens a drawer with the full navigation, organization switcher, common menu and account area | M |
| FR-6.4 | The layout adapts continuously between mobile, tablet and desktop with no horizontal page scroll | M |
| FR-6.5 | Bottom navigation respects device safe areas and does not cover content (content area reserves space) | M |
| FR-6.6 | Bottom navigation with many top-level items remains usable (limited visible slots plus a "More" entry) | S |

### 3.7 Header
| ID | Requirement | Pri |
|---|---|---|
| FR-7.1 | The header shows branding (logo, product name) | M |
| FR-7.2 | The top right has controls to change theme mode (light/dark/system), design style, and language; font selection is optional | M |
| FR-7.3 | Other standard header items (breadcrumbs, search, notifications) are supported through slots and can be omitted | S |
| FR-7.4 | Appearance choices (style, mode, language, font) persist and apply without a flash on load | M |
| FR-7.5 | Header controls are available in the mobile header in a compact form | M |

### 3.8 Footer
| ID | Requirement | Pri |
|---|---|---|
| FR-8.1 | The footer shows a configurable list of menu links (e.g. Terms, Privacy, Help, Contact) and a copyright line | M |
| FR-8.2 | Footer links come from the same typed menu model as the sidebar | S |
| FR-8.3 | On mobile the footer never hides behind the bottom navigation | M |

### 3.9 State management
Each kind of state uses its designated tool. The project adopts the following table.

| State type | Tool | Used for in this project |
|---|---|---|
| Server data (API/DB) | Server Components for initial fetches, plus TanStack Query for client-side fetching, caching and mutations | Session, organizations, menus, user profile |
| Global client/UI state | Zustand | Sidebar collapsed, mobile drawer open, active organization |
| URL state (filters, tabs, pagination) | nuqs (type-safe search params) | Page-level filters, tabs, pagination |
| Forms | React Hook Form + Zod | Any form, including account forms |
| Fine-grained derived state | Jotai (alternative to Zustand) | Only where derived state is needed; not adopted by default |
| Large team, strict patterns, heavy devtools needs | Redux Toolkit | Not adopted; documented as a swap-in option |

| ID | Requirement | Pri |
|---|---|---|
| FR-9.1 | Initial data is fetched in Server Components where possible | M |
| FR-9.2 | Client-side fetching and mutations use TanStack Query with a shared `QueryClient` provider | M |
| FR-9.3 | UI state (sidebar, drawer, active organization) lives in Zustand stores with typed selectors; persisted fields use the persist middleware | M |
| FR-9.4 | Shareable page state uses nuqs, not Zustand | M |
| FR-9.5 | Forms use React Hook Form with Zod schemas shared by client and server | M |
| FR-9.6 | Jotai and Redux Toolkit are not installed unless a concrete need appears | S |
| FR-9.7 | No state type is stored in a tool outside this table without a recorded reason | S |

### 3.10 Roles and organizations (access model)
| ID | Requirement | Pri |
|---|---|---|
| FR-10.1 | A user can hold multiple roles; effective permissions are the union of those roles within the active organization | M |
| FR-10.2 | A user can belong to multiple organizations, with different roles in each | M |
| FR-10.3 | The session model exposes user, organizations, roles per organization and active organization as typed data | M |
| FR-10.4 | Menu visibility is role-aware on the client; route protection is enforced on the server (proxy/layout checks), not only by hiding menu items | M |
| FR-10.5 | The access-check helper (e.g. `hasRole`, `can`) is a single replaceable module | S |

### 3.11 SEO
| ID | Requirement | Pri |
|---|---|---|
| FR-11.1 | Every page exports metadata (title, description, Open Graph, canonical) using the Next.js Metadata API | M |
| FR-11.2 | A shared metadata helper builds page metadata from typed props with site-wide defaults and a title template | M |
| FR-11.3 | Root layout sets `lang`, viewport and theme color; `robots` and `sitemap` routes exist | M |
| FR-11.4 | Dynamic pages use `generateMetadata` | M |
| FR-11.5 | Authenticated areas default to `noindex` | S |
| FR-11.6 | Pages use semantic headings (single `h1`) and landmarks | M |

### 3.12 Typography
| ID | Requirement | Pri |
|---|---|---|
| FR-12.1 | Fonts load through `next/font`; font families are defined in one place and exposed as CSS variables | M |
| FR-12.2 | Type scale (sizes, weights, line heights) is defined through tokens and bokoui Heading/Text components, so changing fonts or scale is a one-file change | M |
| FR-12.3 | Font selection in the header is optional and uses the same font registry | C |

### 3.13 Internationalization
| ID | Requirement | Pri |
|---|---|---|
| FR-13.1 | The language switcher changes the active locale and persists the choice | M |
| FR-13.2 | All shell text comes from message catalogs, not inline strings | S |
| FR-13.3 | Layout supports right-to-left languages | C |

## 4. Non-Functional Requirements
| ID | Requirement |
|---|---|
| NFR-1 | **Accessibility:** WCAG 2.2 AA; keyboard navigation, focus management for drawer and menus, visible focus, reduced motion respected |
| NFR-2 | **Performance:** shell is mostly Server Components; client components only for interactive parts; no layout shift on load or when sidebar state restores |
| NFR-3 | **Theme integrity:** all 8 bokoui styles in light and dark render the shell correctly; no theme flash (`ThemeScript` stays in `<head>`) |
| NFR-4 | **Scalability:** hundreds of menu items, dozens of organizations and deeply nested menus do not degrade usability or layout |
| NFR-5 | **Maintainability:** strict TypeScript, no `any`, consistent naming, small single-purpose components, ESLint clean |
| NFR-6 | **Portability:** the shell has no dependency on mock data or app-specific modules except through interfaces and providers |
| NFR-7 | **Responsiveness:** verified at mobile, tablet and desktop widths in a real browser |
| NFR-8 | **Testability:** menu filtering, access checks and stores are pure and unit testable |
| NFR-9 | **Security:** no secrets or tokens in client stores; authorization decided on the server |

## 5. Proposed Architecture (informative)

```
examples/next-js-layouts/
  src/
    app/
      layout.tsx              # root: html, fonts, ThemeScript, providers
      robots.ts  sitemap.ts
      (auth)/                 # sign-in and related pages
      (dashboard)/            # pages using the shell
        layout.tsx            # AppShell
        page.tsx
        [...feature routes]
    components/
      layout/                 # AppShell, Sidebar, Header, Footer, BottomNav, MobileDrawer
      navigation/             # MenuTree, MenuItem, MenuGroup, SubMenuSheet
      organization/           # OrganizationSwitcher
      account/                # AccountMenu, UserAvatar
      appearance/             # ThemeModeToggle, StyleSwitcher, LanguageSwitcher
    config/                   # site, menus, footer links (mock data, replaceable)
    lib/
      seo/                    # metadata helpers
      access/                 # role and permission checks
      fonts.ts
    services/                 # data access interfaces + mock implementations
    hooks/
    stores/                   # Zustand stores
    providers/                # QueryClient, theme, session, organization
    schemas/                  # Zod schemas
    types/                    # menu, session, organization, role types
    i18n/                     # locale config and message catalogs
```

Data flow: Server Component layout fetches session and menus through `services/`, passes them as props to shell components; client stores hold only UI state. Mock services are swapped for API-backed ones without touching components.

## 6. Acceptance Criteria
1. The shell renders at `examples/next-js-layouts/` with sidebar, header, footer and content area on desktop.
2. Switching organization changes the menu; a user with two roles sees the union of both roles' items.
3. Sidebar collapses and expands, and the state survives a reload without layout shift.
4. On mobile, the sidebar becomes a bottom navigation, sub menus open above it, and the hamburger opens the full drawer.
5. A menu of several hundred items and depth of five levels renders without breaking the layout.
6. Theme mode, design style and language can be changed from the header and persist without a flash.
7. Every page has metadata, and `robots` and `sitemap` routes respond.
8. Each state type uses the tool in the table in section 3.9.
9. Replacing mock services with other implementations requires no change to layout components.
10. `npm run lint` and `npm run typecheck` pass; verified in a real browser at three widths with an accessibility check.

## 7. Out of Scope (initial release)
- Real authentication, authorization backend and API endpoints.
- Real page content, business features and data.
- Frameworks other than Next.js (Vue, Expo).
- Jotai and Redux Toolkit adoption.
- Font selector UI (optional, may follow).

## 8. Open Questions
1. Which i18n library (e.g. next-intl) and which initial languages?
2. Should the layout route-protect with the Next.js proxy, per-layout checks, or both?
3. Should organization be part of the URL (`/[org]/...`) or only in state? URL-based is more shareable; state-based is simpler.
4. Bottom navigation: how many visible slots before "More"?
5. Should the examples project consume bokoui from local Verdaccio like the other examples?
