# Changelog

All notable changes to `bokoui` are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/), and the project uses semantic versioning once it is published publicly (0.x while the API settles; versions so far were published only to a local registry).

## Unreleased

### Added
- **React entry `bokoui/react/client`** for stateful components (marked `"use client"`), keeping `bokoui/react` usable from Server Components.
- **Forms:** FormField, Label, Textarea, Checkbox, Radio, RadioGroup, Switch, Slider, Select, Combobox, DatePicker, Calendar, Rating, FileUpload, Tag.
- **Display:** Badge, Avatar, Card, Divider, Image, Table, Stepper, EmptyState, Skeleton, Progress.
- **Feedback:** Alert, Spinner, Toast (`ToastProvider`, `useToast`).
- **Overlays:** Modal, Drawer, Popover, Tooltip, Menu, CommandPalette, built on native `<dialog>` and the Popover API.
- **Navigation:** Navbar, Sidebar, Tabs, Accordion, Breadcrumb, Pagination.
- **Layout primitives:** Stack, Inline, Grid, Container.
- Vue bindings for Tabs, Modal, Tooltip, Menu and Select (plus the earlier primitives); Expo Modal.
- `bokoui/props.json`: each React component's props, generated from the types.
- Framework-neutral logic in `bokoui/core`: keyboard navigation, positioning, calendar dates, page ranges, file helpers.
- New token `radius-card`.
- Tests: Vitest with Testing Library, axe-core accessibility tests, Vue server-rendering tests.

### Changed
- Contrast audit now also covers tinted ("soft") backgrounds and card surfaces.
- Accordion panels are not `role="region"` unless `regions` is set (avoids landmark noise).

### Fixed
- Warning tone text failed 4.5:1 contrast on light tinted backgrounds in every style; light-mode warning ink now uses 45% tone.
- `cn()` did not know the custom `card` radius, so `rounded-none` did not override `rounded-card`; it now knows the custom radius, shadow, font and ease keys.
- Closed `<dialog>` elements were visible (a base `display` overrode the browser's hidden default).
- `:read-only` styling applied to buttons (Select) through the input recipe.
- Sidebar collapsed styles produced no CSS because class names were built with template strings.
- Vue floating helpers touched `window` during server rendering, returning 500 in Nuxt.
- Calendar date helpers treated years 0-99 as 1900-1999.
