"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Inbox, LayoutDashboard, PanelLeftClose, PanelLeftOpen, Settings, Users } from "lucide-react";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Pagination,
  Sidebar,
  SidebarItem,
  SidebarSection,
  Text,
  sizes,
} from "bokoui/react";
import { Navbar, NavbarBrand, NavbarLink, Tooltip } from "bokoui/react/client";

export function BreadcrumbDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbItem as={Link} href="/">Home</BreadcrumbItem>
        <BreadcrumbItem as={Link} href="/display">Components</BreadcrumbItem>
        <BreadcrumbItem as={Link} href="/navigation">Navigation</BreadcrumbItem>
        <BreadcrumbItem current>Breadcrumb</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb aria-label="Short trail">
        <BreadcrumbItem href="#">Projects</BreadcrumbItem>
        <BreadcrumbItem current>bokoui</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}

export function PaginationDemo() {
  const [page, setPage] = useState(5);
  const [big, setBig] = useState(42);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Pagination page={page} pageCount={10} onPageChange={setPage} />
        <Text variant="small" muted>
          Page {page} of 10
        </Text>
      </div>
      <Pagination page={big} pageCount={120} onPageChange={setBig} siblings={2} aria-label="Many pages" />
      <div className="flex flex-wrap items-center gap-6">
        {sizes.map((size) => (
          <Pagination key={size} page={2} pageCount={4} size={size} onPageChange={() => {}} aria-label={`Size ${size}`} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <Pagination page={2} pageCount={5} onPageChange={() => {}} action="success" hideEdges aria-label="Success, no edges" />
        <Pagination page={3} pageCount={5} getHref={(p) => `/navigation?page=${p}`} linkAs={Link} aria-label="As links" />
      </div>
    </div>
  );
}

export function NavbarDemo() {
  const [active, setActive] = useState("home");
  const link = (id: string, label: string) => (
    <NavbarLink
      href="#"
      active={active === id}
      onClick={(event) => {
        event.preventDefault();
        setActive(id);
      }}
    >
      {label}
    </NavbarLink>
  );
  return (
    <div className="overflow-hidden rounded-card border border-border">
      <Navbar
        aria-label="Demo"
        brand={<NavbarBrand href="#">Acme</NavbarBrand>}
        actions={
          <>
            <Button size="sm" variant="ghost" color="neutral" iconOnly aria-label="Notifications">
              <Bell aria-hidden="true" />
            </Button>
            <Button size="sm">Sign in</Button>
          </>
        }
      >
        {link("home", "Home")}
        {link("products", "Products")}
        {link("pricing", "Pricing")}
        {link("docs", "Docs")}
      </Navbar>
      <div className="p-4">
        <Text variant="small" muted>
          Current page: <strong>{active}</strong>. Narrow the window below 768px to see the menu button.
        </Text>
      </div>
    </div>
  );
}

const sidebarLinks = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard aria-hidden="true" /> },
  { id: "inbox", label: "Inbox", icon: <Inbox aria-hidden="true" />, count: 4 },
  { id: "team", label: "Team", icon: <Users aria-hidden="true" /> },
  { id: "settings", label: "Settings", icon: <Settings aria-hidden="true" /> },
];

export function SidebarDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard");
  return (
    <div className="flex h-96 overflow-hidden rounded-card border border-border">
      <Sidebar aria-label="Demo sidebar" collapsed={collapsed} className="h-full">
        <SidebarSection title="Workspace">
          {sidebarLinks.map((item) => {
            const el = (
              <SidebarItem
                key={item.id}
                href="#"
                icon={item.icon}
                active={active === item.id}
                end={item.count ? <Badge size="sm" variant="solid">{item.count}</Badge> : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  setActive(item.id);
                }}
              >
                {item.label}
              </SidebarItem>
            );
            return collapsed ? (
              <Tooltip key={item.id} content={item.label} placement="right" delay={0}>
                {el}
              </Tooltip>
            ) : (
              el
            );
          })}
        </SidebarSection>
        <SidebarSection title="Other">
          <SidebarItem href="#" icon={<Bell aria-hidden="true" />} disabled>
            Alerts (disabled)
          </SidebarItem>
        </SidebarSection>
      </Sidebar>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Button
            size="sm"
            variant="outline"
            leftIcon={collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
            aria-pressed={collapsed}
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? "Expand" : "Collapse"}
          </Button>
        </div>
        <Text variant="small" muted>
          Active: <strong>{active}</strong>. Collapsed, only icons show and each name appears in a tooltip.
        </Text>
      </div>
    </div>
  );
}
