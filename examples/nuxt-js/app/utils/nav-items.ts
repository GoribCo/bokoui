export interface NavItem {
  to: string
  label: string
  description: string
}

export const navItems: NavItem[] = [
  { to: '/setup', label: 'Setup', description: 'Install and first-time setup' },
  { to: '/', label: 'Home', description: 'Button, Input, typography' },
  { to: '/forms', label: 'Forms', description: 'Fields, Select, Checkbox, Radio, Switch' },
  { to: '/display', label: 'Data display', description: 'Badge, Avatar, Card, Divider, Image' },
  { to: '/feedback', label: 'Feedback', description: 'Alert, Spinner, Toast, Progress, Skeleton' },
  { to: '/data', label: 'Data', description: 'Table, Tag, Rating, Stepper, EmptyState' },
  { to: '/navigation', label: 'Navigation', description: 'Navbar, Sidebar, Breadcrumb, Pagination, Accordion' },
  { to: '/pickers', label: 'Pickers', description: 'Calendar, DatePicker, Combobox, Slider, FileUpload' },
  { to: '/overlays', label: 'Overlays', description: 'Modal, Tooltip, Menu, Popover, CommandPalette' },
  { to: '/tabs', label: 'Tabs', description: 'Horizontal and vertical tabs' },
]
