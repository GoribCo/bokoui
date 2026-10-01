# Plan: align the layouts shell with the reference screenshots

Target: `examples/next-js-layouts/`. Reference images: `docs/images/Screenshot 2026-10-01 at 11.46.18 AM.png` (shell), `11.46.54` (workspace switcher open), `11.47.15` (display settings drawer), `11.47.35` (account menu open).

Status: **implemented** (tasks T9.1 to T9.6). Decisions: search and notifications kept; style switcher kept in the drawer behind `features.styleSwitcher`; "Settings" and "All settings" both go to `/account`; "Manage workspaces" is a stub page at `/organizations`.

## What the red marks ask for

| # | Marked area | Reference | Current app | Gap |
| --- | --- | --- | --- | --- |
| 1 | Top-left of content, beside the sidebar | Header starts right of a full-height sidebar. Left: sidebar toggle (panel icon), a thin divider, then page title ("Dashboard") with a small subtitle ("RxProfile") | Header spans the full width above the sidebar, with branding, breadcrumbs and search. The collapse button is in the sidebar's lower section; mobile has a separate hamburger | Move the toggle into the header; header becomes content-column only; title + subtitle replace branding and breadcrumbs |
| 2 | Top-right | One round icon button (sliders icon) that opens "Display settings" | Inline theme/style/language/font controls on desktop, a palette popover below `lg` | Replace with one button and a drawer |
| 3 | Sidebar top | Workspace switcher: tinted square logo, name, subtitle, up/down chevron. Dropdown: "Workspaces" heading, rows with an icon tile, name and type subtitle, check on the active one, "Manage workspaces" footer link | `OrganizationSwitcher` is already a popover with search, avatar, roles as subtitle, a check | Restyle rows, add heading and footer link; keep search for long lists |
| 4 | Display settings panel | Right drawer: title, subtitle ("Make this site comfortable to read."), round close button. Sections **Appearance** (Theme: System/Light/Dark as labelled segmented buttons; Font Size: Small/Medium/Large) and **Language** (chips with flag + name), then an "All settings →" row | No drawer. Theme is icon-only buttons. No font size. Language is a `<select>` | New drawer component, font-size control, chips with flags |
| 5 | Sidebar bottom | Account trigger: avatar, name, email, chevron. Menu: header card (initials tile, name, email), Profile, Settings with icons, divider, Sign out | `AccountMenu` is a `Menu` with a "Signed in as" label, Manage account, View profile, Log out | Restyle header, rename entries, same data flow |

Also visible: the sidebar's common links ("Resources" heading with Settings, Help, Privacy, Terms) sit just above the account area. That already matches the layout; only add the small "Resources" group heading (check the `common-menu.tsx` output).

## Design decisions

1. **Header becomes a content-column header.** `AppShell` renders the sidebar full height on the left and, in the right column, header then content then footer. On mobile the same header shows the toggle as the hamburger that opens the drawer, so `MobileMenuButton` and the desktop collapse button become one `SidebarToggle` that picks its action by breakpoint (desktop: collapse the rail; below `md`: open the drawer).
2. **Branding moves into the sidebar's top block** (the workspace switcher already shows logo and name). The header no longer needs `branding`; the prop stays optional so a project can still pass it. Mobile shows the page title instead.
3. **Header title and subtitle** come from the active menu item (title) and the active organization/product name (subtitle). The breadcrumb trail is kept for deep pages as a compact line under the title when the item has ancestors; the header's `breadcrumbs` slot remains. Search and notifications stay as optional slots to the left of the settings button, off by default to match the reference (flags in `config/features.ts`).
4. **Display settings drawer** is one component, `DisplaySettingsDrawer`, built on the existing bokoui `Drawer` (`side="right"`). It replaces `AppearanceMenu`. Contents are sections driven by a small config so a project can add or drop controls:
   - Appearance: Theme mode (System/Light/Dark, `useTheme`), Font size (new), optional Style (the bokoui design style; the reference has none but this library needs it, so keep it as a third row, hidden by a `features.styleSwitcher` flag, default on), optional Font family (existing flag).
   - Language: chips built from `locales`, each with a flag and native name.
   - Footer link "All settings" to `/settings`.
5. **Font size** is a new appearance axis, like the theme: `data-font-size="sm|md|lg"` on `<html>`, mapped in CSS to the root font size (`html[data-font-size=sm] { font-size: 93.75% }`, `lg` 112.5%), so every rem-based token scales. Persisted in localStorage and applied before paint by extending the existing `font-script.tsx`, so there is no flash. Because it is global it stays in the example app, not in the bokoui package.
6. **Language chips** replace the select. Selecting still calls the `setLocale` server action then `router.refresh()`. Add `flag` to the locale config (`{ code, flag, nativeName }`), keeping `locales` as the one list to extend.
7. **Switchers and menu restyle only.** No change to roles, org store or menu data flow. "Manage workspaces" links to a new `/organizations` page (stub, mock data) behind a config path; hide the link when the path is unset.

## Work breakdown

Files under `examples/next-js-layouts/src/`.

**Phase A: shell structure**
- `components/layout/app-shell.tsx`: sidebar full height, header inside the right column. Keep the skip link and bottom nav.
- `components/layout/header.tsx`: new slots `toggle`, `title`, `subtitle`, `actions`; drop the forced `branding`; divider after the toggle.
- `components/layout/sidebar.tsx`: remove the collapse button from the bottom; the collapsed rail keeps logo-only switcher and avatar-only account.
- New `components/layout/sidebar-toggle.tsx` (replaces `mobile-menu-button.tsx`); `dashboard-shell.tsx` wires it and derives title/subtitle.
- `components/layout/page-header.tsx` stays for in-page titles; check it does not duplicate the header title.

**Phase B: workspace switcher**
- `organization/organization-switcher.tsx`: "Workspaces" heading, icon tile from the organization type registry (`config/organization-types.ts` icon) when there is no logo, subtitle = type label (reference shows "Branch" / "Personal healthcare"; roles move to a tooltip or are dropped from the row), footer "Manage workspaces" link, search shown only above 6 organizations.
- i18n keys: `organization.workspaces`, `organization.manage`.

**Phase C: display settings**
- New `components/appearance/display-settings-drawer.tsx`, `segmented-control.tsx` (labelled buttons with `aria-pressed`, shared by Theme and Font size), `font-size-control.tsx`, `language-chips.tsx`.
- `components/appearance/theme-mode-toggle.tsx`: labelled variant (keep the icon variant for mobile if still needed).
- `components/appearance/font-script.tsx`: also set `data-font-size` before paint; `lib/fonts/font-options.ts`: `FONT_SIZE_STORAGE_KEY`, sizes list.
- `app/globals.css`: the `[data-font-size]` rules.
- `lib/i18n/config.ts`, `messages/en.json`, `messages/bn.json`: flags, "Display settings", subtitle, Appearance, Theme, Font Size, Small/Medium/Large, Language, "All settings".
- Remove `appearance-menu.tsx` once unused.

**Phase D: account menu**
- `account/account-menu.tsx`: header card with `UserAvatar` (initials tile), name, email; entries Profile, Settings, divider, Sign out. `config/account-menu.ts`: relabel `account.manage` to "Settings" (`/account`), keep `account.profile` as "Profile". Drop the "Signed in as" caption.

**Phase E: docs and checks**
- Update `README.md` (header slots, how to add a display setting), `docs/srs/srs-layouts.md` (FR-2.x toggle location, FR-7.2/7.5 drawer, new FR for font size), `docs/tasks/tasks-layouts.md` (new phase with checkboxes), `docs/component-status.md`.
- `npm run lint` and `npm run typecheck` in `examples/next-js-layouts`.
- Browser check (per the project's verify-in-a-real-browser rule): puppeteer-core + axe on a cloned build at 375, 768 and 1280 px, all 8 styles, light and dark. Cases: toggle collapse and persistence across reload, drawer focus trap and Escape, font size without flash on reload, Bangla language, switcher with 1, 4 and 30 organizations, account menu from the collapsed rail.

## Risks

- **Header move touches every page's layout.** Sticky offsets, the skip link and the bottom-nav padding must be re-checked.
- **Font size scales rem**, so any px-sized layout (sidebar width token) will not scale; make the sidebar width rem-based if it is not.
- **Drawer in styles with strong borders** (brutalism, neo-brutalism): check the divider and the close button against each style rather than hard-coding the reference's thin lines.
- **Dependence on the installed `bokoui` version**: `Drawer` already supports `side="right"`; if a segmented control is wanted as a library component later, that is a separate bokoui task.

## Open questions

1. Keep search and notifications in the header (off by default), or drop them as in the reference?
2. Keep the design-style switcher in Display settings (library showcase) or remove it from this app?
3. Should "Settings" in the account menu and "All settings" go to the same `/settings` page, with `/account` retired?
4. Is "Manage workspaces" a real page now, or a stub link?
