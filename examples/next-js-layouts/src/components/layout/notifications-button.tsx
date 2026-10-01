"use client";

import { Bell, CalendarClock, CircleCheck, ClipboardCheck, MailPlus, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "bokoui/react";
import { Popover, Tab, TabList, TabPanel, Tabs } from "bokoui/react/client";
import { features } from "@/lib/config/features";
import { shortcuts } from "@/lib/config/shortcuts";
import type { Notification } from "@/lib/types";

export type NotificationTab = "all" | "unread" | "urgent" | "invitations";

const tabs: NotificationTab[] = ["all", "unread", "urgent", "invitations"];

export interface NotificationsButtonProps {
  labels: {
    /** Accessible name of the button and heading of the panel. */
    title: string;
    empty: string;
    /** Contains `{count}`. */
    unread: (count: number) => string;
    markAllRead: string;
    viewAll: string;
    tabs: Record<NotificationTab, string>;
  };
  items?: Notification[];
  /** Marks the given notifications read; all of them when `ids` is omitted. */
  onMarkRead: (ids?: string[]) => void;
  /** Target of the footer link; the link is hidden when unset. */
  viewAllHref?: string;
}

const kindIcon: Record<Notification["kind"], LucideIcon> = {
  action: ClipboardCheck,
  info: CalendarClock,
  success: CircleCheck,
  invitation: MailPlus,
};

function NotificationRow({ item, unread, onOpen }: { item: Notification; unread: boolean; onOpen: () => void }) {
  const Icon = kindIcon[item.kind ?? "info"];
  const content = (
    <>
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-control bg-muted text-muted-foreground [&_svg]:size-4"
      >
        <Icon />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-baseline justify-between gap-3">
          <span className={`truncate text-nav ${unread ? "font-semibold" : "font-medium"}`}>{item.title}</span>
          {item.time ? <span className="shrink-0 text-caption text-muted-foreground tabular-nums">{item.time}</span> : null}
        </span>
        {item.body ? <span className="text-caption text-muted-foreground">{item.body}</span> : null}
      </span>
    </>
  );
  const className = `flex items-start gap-3 border-s-2 px-3 py-2.5 text-start hover:bg-muted focus-ring ${
    unread ? "border-primary" : "border-transparent"
  }`;

  return item.href ? (
    <Link href={item.href} prefetch={false} className={className} onClick={onOpen}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

/** Bell that opens a panel of notifications: unread ones marked by an accent edge, with mark-all-read and a link to the full list. */
export function NotificationsButton({ labels, items = [], onMarkRead, viewAllHref }: NotificationsButtonProps) {
  const isUnread = (item: Notification) => item.unread;
  const count = items.filter(isUnread).length;
  const [tab, setTab] = useState<NotificationTab>("all");
  const panelRef = useRef<HTMLDivElement>(null);
  const matches: Record<NotificationTab, (item: Notification) => boolean> = {
    all: () => true,
    unread: isUnread,
    urgent: (item) => Boolean(item.urgent),
    invitations: (item) => item.kind === "invitation",
  };
  const visible = items.filter(matches[tab]);

  return (
    <Popover
      placement="bottom-end"
      aria-label={labels.title}
      className="w-[min(24rem,calc(100vw-1.5rem))] max-h-[min(36rem,calc(100dvh-5rem))] p-0"
      trigger={
        <Button
          variant="ghost"
          color="neutral"
          iconOnly
          className="relative"
          aria-label={count > 0 ? `${labels.title}, ${labels.unread(count)}` : labels.title}
          aria-haspopup="dialog"
          data-shortcut="notifications"
          aria-keyshortcuts={features.keyboardShortcuts ? shortcuts.notifications.keyshortcuts : undefined}
          title={features.keyboardShortcuts ? `${labels.title} (${shortcuts.notifications.hint})` : undefined}
        >
          <Bell aria-hidden="true" />
          {count > 0 ? (
            <span aria-hidden="true" className="absolute end-2 top-2 size-2 rounded-full bg-primary ring-2 ring-background" />
          ) : null}
        </Button>
      }
    >
      <div ref={panelRef} className="flex flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2.5">
          <div className="flex min-w-0 flex-col">
            <h2 className="text-nav font-semibold">{labels.title}</h2>
            {count > 0 ? <span className="text-caption text-muted-foreground">{labels.unread(count)}</span> : null}
          </div>
          {count > 0 ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                // The button disappears once nothing is unread; keep focus in the panel so Escape still works.
                panelRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus();
                onMarkRead();
              }}
            >
              {labels.markAllRead}
            </Button>
          ) : null}
        </div>
        <Tabs value={tab} onValueChange={(value) => setTab(value as NotificationTab)}>
          <TabList aria-label={labels.title} className="overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&_button]:px-2 [&_button]:text-[0.8125rem] [&_button]:pointer-coarse:min-w-11">
            {tabs.map((value) => {
              const total = items.filter(matches[value]).length;
              return (
                <Tab key={value} value={value}>
                  {labels.tabs[value]}
                  {value !== "all" && total > 0 ? (
                    <span className="ms-1 text-caption text-muted-foreground tabular-nums">{total}</span>
                  ) : null}
                </Tab>
              );
            })}
          </TabList>
          <TabPanel value={tab}>
            {visible.length === 0 ? (
              <p className="px-3 py-8 text-center text-nav text-muted-foreground">{labels.empty}</p>
            ) : (
              <ul className="flex max-h-[min(22rem,60dvh)] flex-col divide-y divide-border overflow-y-auto">
                {visible.map((item) => (
                  <li key={item.id}>
                    <NotificationRow item={item} unread={isUnread(item)} onOpen={() => item.unread && onMarkRead([item.id])} />
                  </li>
                ))}
              </ul>
            )}
          </TabPanel>
        </Tabs>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            prefetch={false}
            className="border-t border-border px-3 py-2.5 text-center text-nav font-medium hover:bg-muted focus-ring"
          >
            {labels.viewAll}
          </Link>
        ) : null}
      </div>
    </Popover>
  );
}
