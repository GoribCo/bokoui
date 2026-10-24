# Layout and form patterns

Task T8.5. This file was empty when the task was picked up, so it records what was built and why.

## Approach

Layout is Tailwind. bokoui adds only what benefits from being a shared, tested component:

1. **Primitives** that arrange children and set no colors, so they never fight a style.
2. **Patterns**: whole-page compositions built only from bokoui components, shown in the Next.js demo (`/patterns`). They are examples to copy, not extra components to install.

## Primitives (`bokoui/react`)

| Component | Does | Notes |
| --- | --- | --- |
| `Stack` | Column with a gap | `gap` 0-12, `align` |
| `Inline` | Wrapping row with a gap | `gap`, `align`, `justify`; button rows, tag lists, toolbars |
| `Grid` | Responsive columns | `cols` 1, 2, 3, 4 or `auto` (as many 16rem columns as fit) |
| `Container` | Centered max-width with side padding | `size` sm/md/lg/xl/full |

All accept `as` (`ul`, `section`, `nav`, ...) and `className`. Gap and column values map to fixed class names, because Tailwind cannot see names assembled at runtime.

Not built, on purpose: a `Box`/`Flex` with arbitrary style props (Tailwind classes already do this), and a `Spacer` (use `gap` or `ms-auto`).

## Patterns (`examples/next-js/src/app/patterns`)

| Pattern | Shows |
| --- | --- |
| Sign-in form | Required fields, hints, native validation, a loading button, a success toast, a divider with a label |
| Settings | Cards grouping fields; Save/Discard enabled only when something changed; switches and a slider |
| Dashboard | Stat cards (badge for the trend, progress toward a goal), a table with status badges, an empty state |
| Multi-step wizard | `Stepper` for progress, validation gating Continue, a live region for the step content |

The app shell itself is a pattern too: `examples/next-js/src/components/side-nav.tsx` builds the desktop `Sidebar` (collapsible to an icon rail with tooltips) and the mobile `Navbar` from the library components.

## Form conventions

- Wrap every control in `FormField`; it links label, hint and error with `id` and `aria-describedby`, and marks the control invalid.
- Prefer native validation attributes (`required`, `minLength`, `type="email"`) and let `error` carry server or custom messages.
- Put the primary action last, right-aligned in an `Inline` (or full width on a narrow card); a destructive action uses `action="danger"`.
- Disable Save until the form is dirty; announce results with a toast rather than a silent state change.
- Group related fields in a `Card` with a `Heading` and a one-line description.

## Open

- Vue and Expo versions of the primitives (Expo would map `Stack`/`Inline` to `View` with `gap`).
- Pattern pages are React-only; Nuxt equivalents once the remaining Vue ports exist.
