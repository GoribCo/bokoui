"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useMemo, useState, type KeyboardEvent } from "react";
import { Avatar, Input } from "bokoui/react";
import { Popover, Tooltip } from "bokoui/react/client";
import type { Organization } from "@/types";

export interface OrganizationSwitcherLabels {
  /** Accessible name of the trigger and the list. */
  switch: string;
  search: string;
  noResults: string;
}

export interface OrganizationSwitcherProps {
  organizations: Organization[];
  activeOrganizationId: string;
  onSelect: (organizationId: string) => void;
  /** Icon-only rail: only the logo shows, the name moves into a tooltip. */
  collapsed?: boolean;
  labels: OrganizationSwitcherLabels;
}

const rowClass =
  "flex w-full min-w-0 items-center gap-3 rounded-control px-2 py-2 text-start text-nav focus-ring pointer-coarse:min-h-11";

function OrganizationSummary({ organization, hideText }: { organization: Organization; hideText?: boolean }) {
  return (
    <>
      <Avatar size="sm" shape="square" src={organization.logoUrl} name={organization.name} />
      {hideText ? null : (
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium">{organization.name}</span>
          <span className="truncate text-caption text-muted-foreground capitalize">{organization.roles.join(", ")}</span>
        </span>
      )}
    </>
  );
}

/**
 * Shows the active organization and lets the user pick another: a searchable, scrollable list that
 * copes with dozens of organizations. With a single organization it is a plain label (FR-3.1 to FR-3.3).
 */
export function OrganizationSwitcher({
  organizations,
  activeOrganizationId,
  onSelect,
  collapsed = false,
  labels,
}: OrganizationSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const active = organizations.find((org) => org.id === activeOrganizationId) ?? organizations[0];
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? organizations.filter((org) => org.name.toLowerCase().includes(needle)) : organizations;
  }, [organizations, query]);

  if (!active) return null;

  if (organizations.length === 1) {
    return (
      <Tooltip content={active.name} placement="right" disabled={!collapsed}>
        <div
          className={`${rowClass} ${collapsed ? "justify-center px-0" : ""}`}
          tabIndex={collapsed ? 0 : undefined}
          aria-label={collapsed ? active.name : undefined}
        >
          <OrganizationSummary organization={active} hideText={collapsed} />
        </div>
      </Tooltip>
    );
  }

  const choose = (organizationId: string) => {
    onSelect(organizationId);
    setOpen(false);
  };

  const moveFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const panel = event.currentTarget.closest<HTMLElement>("[data-org-panel]");
    if (!panel) return;
    const items = [...panel.querySelectorAll<HTMLElement>("[data-org-item]")];
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next = event.key === "ArrowDown" ? index + 1 : index - 1;
    const target = items[Math.min(Math.max(next, 0), items.length - 1)];
    if (target) {
      event.preventDefault();
      target.focus();
    }
  };

  const trigger = (
    <button
      type="button"
      aria-label={collapsed ? `${labels.switch}: ${active.name}` : labels.switch}
      // A native title: Popover needs the trigger itself for its ref, so it cannot be wrapped in a Tooltip.
      title={collapsed ? active.name : undefined}
      aria-haspopup="dialog"
      aria-expanded={open}
      className={`${rowClass} border border-border bg-background hover:bg-muted ${collapsed ? "size-10 justify-center p-0" : ""}`}
    >
      <OrganizationSummary organization={active} hideText={collapsed} />
      {collapsed ? null : <ChevronsUpDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />}
    </button>
  );

  return (
    <Popover
      trigger={trigger}
      placement={collapsed ? "right-start" : "bottom-start"}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
      aria-label={labels.switch}
      className="w-72"
    >
      <div data-org-panel className="flex flex-col gap-1">
        <Input
          size="sm"
          value={query}
          placeholder={labels.search}
          aria-label={labels.search}
          startAdornment={<Search aria-hidden="true" />}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              event.currentTarget.closest("[data-org-panel]")?.querySelector<HTMLElement>("[data-org-item]")?.focus();
            }
          }}
        />
        {visible.length === 0 ? (
          <p className="px-2 py-3 text-center text-nav text-muted-foreground">{labels.noResults}</p>
        ) : (
          <ul aria-label={labels.switch} className="flex max-h-52 flex-col gap-0.5 overflow-y-auto">
            {visible.map((org) => (
              <li key={org.id}>
                <button
                  type="button"
                  data-org-item
                  aria-current={org.id === active.id ? "true" : undefined}
                  className={`${rowClass} hover:bg-muted aria-[current=true]:bg-muted`}
                  onClick={() => choose(org.id)}
                  onKeyDown={moveFocus}
                >
                  <OrganizationSummary organization={org} />
                  {org.id === active.id ? <Check aria-hidden="true" className="size-4 shrink-0" /> : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Popover>
  );
}
