import {
  BarChart3, Building2, Calculator, Calendar, Circle, ClipboardList, FileText, Hospital, HelpCircle, LayoutDashboard, Lock, Package,
  Palette, Pill, Settings, Shield, Truck, User, Users, Wallet,
} from '@lucide/vue'
import type { Component } from 'vue'

/** Menu data names its icon; only the icons listed here are bundled. */
const registry: Record<string, Component> = {
  'bar-chart': BarChart3,
  'building-2': Building2,
  calculator: Calculator,
  calendar: Calendar,
  clipboard: ClipboardList,
  'file-text': FileText,
  'help-circle': HelpCircle,
  hospital: Hospital,
  'layout-dashboard': LayoutDashboard,
  lock: Lock,
  package: Package,
  palette: Palette,
  pill: Pill,
  settings: Settings,
  shield: Shield,
  truck: Truck,
  user: User,
  users: Users,
  wallet: Wallet,
}

export const iconFor = (name?: string): Component => (name && registry[name]) || Circle
