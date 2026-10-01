"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { MenuIcon } from "@/components/navigation/menu-icon";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { organizationTypes } from "@/lib/config/organization-types";
import type { Organization } from "@/lib/types";

/** Lists longer than this get a search box. */
const SEARCH_THRESHOLD = 6;

export interface OrganizationSwitcherLabels {
  /** Accessible name of the trigger and the list. */
  switch: string;
  search: string;
  noResults: string;
  /** Heading of the list ("Workspaces"). */
  workspaces: string;
  /** Footer link text ("Manage workspaces"). */
  manage: string;
}

export interface OrganizationSwitcherProps {
  organizations: Organization[];
  activeOrganizationId: string;
  onSelect: (organizationId: string) => void;
  /** Target of the footer link; the link is hidden when unset. */
  manageHref?: string;
  labels: OrganizationSwitcherLabels;
}

function useTypeLabel() {
  const t = useTranslations("organizationType");
  return (organization: Organization) =>
    t.has(organization.type) ? t(organization.type) : organizationTypes[organization.type].label;
}

function Tile({ organization }: { organization: Organization }) {
  return (
    <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground [&_svg]:size-4">
      <MenuIcon name={organizationTypes[organization.type].icon} />
    </div>
  );
}

function Summary({ organization, subtitle }: { organization: Organization; subtitle: string }) {
  return (
    <>
      <Tile organization={organization} />
      <div className="grid min-w-0 flex-1 text-start text-sm leading-tight">
        <span className="truncate font-medium">{organization.name}</span>
        <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
      </div>
    </>
  );
}

/**
 * Shows the active organization and lets the user pick another: a searchable list (shadcn `Command` in
 * a `Popover`) that copes with dozens of organizations. With a single organization it is a plain label
 * (FR-3.1 to FR-3.3).
 */
export function OrganizationSwitcher({
  organizations,
  activeOrganizationId,
  onSelect,
  manageHref,
  labels,
}: OrganizationSwitcherProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  const typeLabel = useTypeLabel();
  const [open, setOpen] = useState(false);

  const active = organizations.find((org) => org.id === activeOrganizationId) ?? organizations[0];
  if (!active) return null;

  if (organizations.length === 1) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild size="lg" tooltip={active.name}>
            <div>
              <Summary organization={active} subtitle={typeLabel(active)} />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={active.name}
              aria-label={labels.switch}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Summary organization={active} subtitle={typeLabel(active)} />
              <ChevronsUpDown aria-hidden="true" className="ms-auto size-4" />
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
            aria-label={labels.switch}
            className="w-72 p-0"
          >
            <Command>
              {organizations.length > SEARCH_THRESHOLD ? <CommandInput placeholder={labels.search} /> : null}
              <CommandList>
                <CommandEmpty>{labels.noResults}</CommandEmpty>
                <CommandGroup heading={labels.workspaces}>
                  {organizations.map((org) => (
                    <CommandItem
                      key={org.id}
                      value={org.name}
                      title={org.roles.join(", ")}
                      onSelect={() => {
                        onSelect(org.id);
                        setOpen(false);
                        setOpenMobile(false);
                      }}
                      className="gap-2 p-2"
                    >
                      <Tile organization={org} />
                      <div className="grid min-w-0 flex-1 leading-tight">
                        <span className="truncate font-medium">{org.name}</span>
                        <span className="truncate text-xs text-muted-foreground">{typeLabel(org)}</span>
                      </div>
                      {org.id === active.id ? <Check aria-hidden="true" className="ms-auto size-4" /> : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {manageHref ? (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem asChild>
                        <Link
                          href={manageHref}
                          prefetch={false}
                          onClick={() => {
                            setOpen(false);
                            setOpenMobile(false);
                          }}
                        >
                          {labels.manage}
                        </Link>
                      </CommandItem>
                    </CommandGroup>
                  </>
                ) : null}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
