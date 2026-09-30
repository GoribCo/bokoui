"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Layers, LayoutGrid, MessageSquare, MousePointerClick, PanelLeftClose, PanelLeftOpen, Table2, TextCursorInput, Compass, Home } from "lucide-react";
import { Button, Sidebar, SidebarItem, SidebarSection } from "bokoui/react";
import { Navbar, NavbarBrand, NavbarLink, Tooltip } from "bokoui/react/client";
import { navItems } from "./nav-items";

const icons: Record<string, React.ReactNode> = {
  "/": <Home aria-hidden="true" />,
  "/forms": <TextCursorInput aria-hidden="true" />,
  "/display": <LayoutGrid aria-hidden="true" />,
  "/table": <Table2 aria-hidden="true" />,
  "/feedback": <Bell aria-hidden="true" />,
  "/overlays": <MessageSquare aria-hidden="true" />,
  "/tabs": <Layers aria-hidden="true" />,
  "/navigation": <Compass aria-hidden="true" />,
};

function useActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
}

/** Desktop: bokoui `Sidebar`, collapsible to an icon rail. */
export function SideNav() {
  const isActive = useActive();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sidebar
      aria-label="Pages"
      collapsed={collapsed}
      className="sticky top-[57px] hidden h-[calc(100dvh-57px)] md:flex"
    >
      <SidebarSection title="Components">
        {navItems.map((item) => {
          const link = (
            <SidebarItem
              key={item.href}
              as={Link}
              href={item.href}
              active={isActive(item.href)}
              icon={icons[item.href] ?? <MousePointerClick aria-hidden="true" />}
              description={item.description}
            >
              {item.label}
            </SidebarItem>
          );
          // The rail shows only icons, so name them on hover and focus.
          return collapsed ? (
            <Tooltip key={item.href} content={item.label} placement="right" delay={0}>
              {link}
            </Tooltip>
          ) : (
            link
          );
        })}
      </SidebarSection>
      <div className="mt-auto pt-3">
        <Button
          variant="ghost"
          color="neutral"
          size="sm"
          iconOnly={collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={collapsed}
          onClick={() => setCollapsed((v) => !v)}
          leftIcon={collapsed ? undefined : <PanelLeftClose aria-hidden="true" />}
        >
          {collapsed ? <PanelLeftOpen aria-hidden="true" /> : "Collapse"}
        </Button>
      </div>
    </Sidebar>
  );
}

/** Small screens: bokoui `Navbar` with the same links behind a menu button. */
export function MobileNav() {
  const isActive = useActive();
  return (
    <Navbar
      className="md:hidden"
      aria-label="Pages"
      brand={
        <NavbarBrand as={Link} href="/">
          bokoui
        </NavbarBrand>
      }
    >
      {navItems.map((item) => (
        <NavbarLink key={item.href} as={Link} href={item.href} active={isActive(item.href)}>
          {item.label}
        </NavbarLink>
      ))}
    </Navbar>
  );
}
