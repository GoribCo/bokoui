export interface NavItem {
  href: string;
  label: string;
  /** Short list of what the page shows. */
  description: string;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Home", description: "Button, Input, typography" },
  { href: "/forms", label: "Forms", description: "Fields, Select, Checkbox, Radio, Switch" },
  { href: "/display", label: "Data display", description: "Badge, Avatar, Card, Divider, Image" },
  { href: "/feedback", label: "Feedback", description: "Alert, Spinner" },
  { href: "/overlays", label: "Overlays", description: "Modal, Tooltip, Menu" },
  { href: "/tabs", label: "Tabs", description: "Horizontal and vertical tabs" },
];
