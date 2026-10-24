export interface NavItem {
  to: string
  label: string
  description: string
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Home', description: 'Button, Input, typography' },
  { to: '/forms', label: 'Forms', description: 'Fields, Select, Checkbox, Radio, Switch' },
  { to: '/display', label: 'Data display', description: 'Badge, Avatar, Card, Divider, Image' },
  { to: '/feedback', label: 'Feedback', description: 'Alert, Spinner' },
  { to: '/overlays', label: 'Overlays', description: 'Modal, Tooltip, Menu' },
  { to: '/tabs', label: 'Tabs', description: 'Horizontal and vertical tabs' },
]
