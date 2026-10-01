"use client";

import { Bell, CalendarClock, CircleCheck, ClipboardCheck, MailPlus, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type NotificationTab = "all" | "unread" | "urgent" | "invitations";

const tabs: NotificationTab[] = ["all", "unread", "urgent", "invitations"];

export interface NotificationItem {
  id: string;
  /** `action` needs a decision, `info` is for awareness, `success` confirms something done. */
  kind?: "action" | "info" | "success" | "invitation";
  /** Listed under the Urgent tab. */
  urgent?: boolean;
  title: string;
  body?: string;
  /** Time or relative time, already formatted. */
  time?: string;
  unread?: boolean;
  href?: string;
}

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
  items?: NotificationItem[];
  /** Target of the footer link; the link is hidden when unset. */
  viewAllHref?: string;
}

const kindIcon: Record<NonNullable<NotificationItem["kind"]>, LucideIcon> = {
  action: ClipboardCheck,
  info: CalendarClock,
  success: CircleCheck,
  invitation: MailPlus,
};

function NotificationRow({ item, unread, onOpen }: { item: NotificationItem; unread: boolean; onOpen: () => void }) {
  const Icon = kindIcon[item.kind ?? "info"];
  const content = (
    <>
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-4"
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
  const className = `flex items-start gap-3 border-s-2 px-3 py-2.5 text-start hover:bg-muted outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 ${
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
export function NotificationsButton({ labels, items = [], viewAllHref }: NotificationsButtonProps) {
  const [read, setRead] = useState<ReadonlySet<string>>(new Set());
  const isUnread = (item: NotificationItem) => Boolean(item.unread) && !read.has(item.id);
  const count = items.filter(isUnread).length;
  const [tab, setTab] = useState<NotificationTab>("all");
  const matches: Record<NotificationTab, (item: NotificationItem) => boolean> = {
    all: () => true,
    unread: isUnread,
    urgent: (item) => Boolean(item.urgent),
    invitations: (item) => item.kind === "invitation",
  };
  const visible = items.filter(matches[tab]);
  const markRead = (...ids: string[]) => setRead((prev) => new Set([...prev, ...ids]));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={count > 0 ? `${labels.title}, ${labels.unread(count)}` : labels.title}
        >
          <Bell aria-hidden="true" />
          {count > 0 ? (
            <span aria-hidden="true" className="absolute end-2 top-2 size-2 rounded-full bg-primary ring-2 ring-background" />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        aria-label={labels.title}
        className="w-[min(24rem,calc(100vw-1.5rem))] p-0"
      >
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2.5">
          <div className="flex min-w-0 flex-col">
            <h2 className="text-nav font-semibold">{labels.title}</h2>
            {count > 0 ? <span className="text-caption text-muted-foreground">{labels.unread(count)}</span> : null}
          </div>
          {count > 0 ? (
            <Button size="sm" variant="ghost" onClick={() => markRead(...items.map((item) => item.id))}>
              {labels.markAllRead}
            </Button>
          ) : null}
        </div>
        <Tabs value={tab} onValueChange={(value) => setTab(value as NotificationTab)}>
          <TabsList aria-label={labels.title} className="w-full justify-start rounded-none border-b bg-transparent p-0">
            {tabs.map((value) => {
              const total = items.filter(matches[value]).length;
              return (
                <TabsTrigger key={value} value={value}>
                  {labels.tabs[value]}
                  {value !== "all" && total > 0 ? (
                    <span className="ms-1 text-caption text-muted-foreground tabular-nums">{total}</span>
                  ) : null}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <TabsContent value={tab}>
            {visible.length === 0 ? (
              <p className="px-3 py-8 text-center text-nav text-muted-foreground">{labels.empty}</p>
            ) : (
              <ul className="flex max-h-[min(22rem,60dvh)] flex-col divide-y divide-border overflow-y-auto">
                {visible.map((item) => (
                  <li key={item.id}>
                    <NotificationRow item={item} unread={isUnread(item)} onOpen={() => markRead(item.id)} />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            prefetch={false}
            className="border-t border-border px-3 py-2.5 text-center text-nav font-medium hover:bg-muted outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {labels.viewAll}
          </Link>
        ) : null}
      </div>
      </PopoverContent>
    </Popover>
  );
}
