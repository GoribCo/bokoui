import { DASHBOARD_PATH } from "@/lib/config/auth";
import type { MenuGroup, MenuItem } from "@/lib/types";

const departments = [
  "Cardiology",
  "Neurology",
  "Oncology",
  "Pediatrics",
  "Orthopedics",
  "Radiology",
  "Emergency Medicine",
  "Obstetrics and Gynecology",
];
const wards = ["Ward A", "Ward B", "Ward C", "Ward D"];
const units = ["Intensive Care Unit", "High Dependency Unit", "General Care"];
const teams = ["Morning shift team", "Evening shift team"];
const resources = ["Rosters and on-call schedules", "Equipment and consumables inventory"];

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Builds one level of the departments tree; `path` accumulates slugs for ids and hrefs. */
function level(names: string[][], depth: number, path: string[]): MenuItem[] {
  return names[depth].map((name) => {
    const nextPath = [...path, slug(name)];
    const item: MenuItem = {
      id: `dept-${nextPath.join("-")}`,
      label: name,
      href: `/departments/${nextPath.join("/")}`,
    };
    if (depth < names.length - 1) item.children = level(names, depth + 1, nextPath);
    return item;
  });
}

/** About 700 items, five levels deep: stress data for the navigation UI. */
function departmentsTree(): MenuItem[] {
  const tree = level([departments, wards, units, teams, resources], 0, []);
  // Oncology is visible to doctors only.
  return tree.map((item) => (item.label === "Oncology" ? { ...item, requiredRoles: ["doctor"] } : item));
}

/** Sample screens that show a design style at work; every organization gets the same group. */
const stylesGroup: MenuGroup = {
  id: "styles",
  label: "Style showcase",
  items: [
    { id: "style-gallery", label: "Style gallery", icon: "palette", href: "/examples/styles" },
    { id: "style-home", label: "Sample: home", icon: "layout-dashboard", href: "/examples/showcase-home" },
    { id: "style-settings", label: "Sample: settings", icon: "settings", href: "/examples/showcase-settings" },
    { id: "style-calculator", label: "Sample: calculator", icon: "calculator", href: "/examples/showcase-calculator" },
  ],
};

export const hospitalMenu: MenuGroup[] = [
  {
    id: "overview",
    label: "Overview",
    labelKey: "menu.groups.overview",
    items: [
      { id: "dashboard", label: "Dashboard", labelKey: "menu.dashboard", icon: "layout-dashboard", href: DASHBOARD_PATH },
      { id: "schedule", label: "Schedule", icon: "calendar", href: "/examples/table", badge: 3 },
    ],
  },
  {
    id: "clinical",
    label: "Clinical",
    items: [
      { id: "patients", label: "Patients", icon: "users", href: "/examples/filters" },
      {
        id: "departments",
        label: "Departments, wards and clinical units",
        icon: "hospital",
        children: departmentsTree(),
      },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    requiredRoles: ["admin"],
    items: [
      { id: "staff", label: "Staff directory", icon: "users", href: "/examples/form" },
      { id: "admin-area", label: "Access control", icon: "shield", href: "/admin", requiredPermissions: ["organization.access.view"] },
      { id: "reports", label: "Reports", icon: "bar-chart", href: "/examples/long-page", requiredPermissions: ["organization.reports.view"] },
    ],
  },
  stylesGroup,
];

const pharmacyMenu: MenuGroup[] = [
  {
    id: "overview",
    label: "Overview",
    labelKey: "menu.groups.overview",
    items: [{ id: "dashboard", label: "Dashboard", labelKey: "menu.dashboard", icon: "layout-dashboard", href: DASHBOARD_PATH }],
  },
  {
    id: "inventory",
    label: "Inventory",
    items: [
      { id: "stock", label: "Stock", icon: "package", href: "/examples/table" },
      {
        id: "orders",
        label: "Orders",
        icon: "truck",
        children: [
          { id: "orders-open", label: "Open orders", href: "/examples/filters", badge: 12 },
          { id: "orders-history", label: "Order history", href: "/examples/long-page" },
        ],
      },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    items: [{ id: "prescriptions", label: "Prescriptions", icon: "clipboard", href: "/examples/form" }],
  },
  stylesGroup,
];

const companyMenu: MenuGroup[] = [
  {
    id: "overview",
    label: "Overview",
    labelKey: "menu.groups.overview",
    items: [{ id: "dashboard", label: "Dashboard", labelKey: "menu.dashboard", icon: "layout-dashboard", href: DASHBOARD_PATH }],
  },
  {
    id: "people",
    label: "People",
    items: [
      { id: "employees", label: "Employees", icon: "users", href: "/examples/table" },
      { id: "hiring", label: "Hiring", icon: "clipboard", href: "/examples/form" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    requiredRoles: ["manager"],
    items: [
      { id: "budgets", label: "Budgets", icon: "wallet", href: "/examples/filters" },
      { id: "invoices", label: "Invoices", icon: "file-text", href: "/examples/long-page" },
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    requiredRoles: ["auditor"],
    items: [{ id: "audits", label: "Audit log", icon: "shield", href: "/admin" }],
  },
  stylesGroup,
];

export const menusByOrganization: Record<string, MenuGroup[]> = {
  "org-hospital": hospitalMenu,
  "org-pharmacy": pharmacyMenu,
  "org-company": companyMenu,
};
