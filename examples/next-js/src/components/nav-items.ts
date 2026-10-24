export interface NavItem {
  href: string;
  label: string;
  /** Short list of what the page shows. */
  description: string;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Home", description: "Button, Input, typography" },
  { href: "/playground", label: "Overview", description: "Get started and component index" },
  { href: "/forms", label: "Forms", description: "Fields, Select, Checkbox, Radio, Switch" },
  { href: "/display", label: "Data display", description: "Badge, Avatar, Card, Divider, Image" },
  { href: "/table", label: "Table", description: "Sorting, paging, density" },
  { href: "/feedback", label: "Feedback", description: "Alert, Spinner" },
  { href: "/overlays", label: "Overlays", description: "Modal, Tooltip, Menu" },
  { href: "/tabs", label: "Tabs", description: "Horizontal and vertical tabs" },
  { href: "/accordion", label: "Accordion", description: "Single and multiple, animated" },
  { href: "/patterns", label: "Patterns", description: "Layout primitives, forms, dashboard" },
  { href: "/navigation", label: "Navigation", description: "Navbar, Breadcrumb, Pagination, Sidebar" },
];
