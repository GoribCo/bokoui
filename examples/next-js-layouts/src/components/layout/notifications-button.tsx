"use client";

import { Bell } from "lucide-react";
import { Badge, Button } from "bokoui/react";
import { Popover } from "bokoui/react/client";

export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  /** Relative time, already formatted. */
  time?: string;
  unread?: boolean;
}

export interface NotificationsButtonProps {
  label: string;
  /** Heading of the panel; defaults to `label`. */
  title?: string;
  /** Shown when `items` is empty. */
  emptyLabel: string;
  items?: NotificationItem[];
}

/** Bell with an unread count; opens a panel listing the notifications. */
export function NotificationsButton({ label, title, emptyLabel, items = [] }: NotificationsButtonProps) {
  const count = items.filter((item) => item.unread).length;

  return (
    <Popover
      placement="bottom-end"
      aria-label={title ?? label}
      className="w-[min(22rem,calc(100vw-1.5rem))]"
      trigger={
        <span className="relative inline-flex">
          <Button
            variant="ghost"
            color="neutral"
            iconOnly
            aria-label={count > 0 ? `${label} (${count})` : label}
            aria-haspopup="dialog"
          >
            <Bell aria-hidden="true" />
          </Button>
          {count > 0 ? (
            <Badge size="sm" action="danger" aria-hidden="true" className="pointer-events-none absolute -end-1 -top-1">
              {count > 99 ? "99+" : count}
            </Badge>
          ) : null}
        </span>
      }
    >
      <div className="flex flex-col gap-1">
        <p className="px-2 pt-1 text-caption text-muted-foreground">{title ?? label}</p>
        {items.length === 0 ? (
          <p className="px-2 py-4 text-center text-nav text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ul className="flex max-h-80 flex-col overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} className="flex gap-2 rounded-control px-2 py-2 text-start hover:bg-muted">
                <span
                  aria-hidden="true"
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${item.unread ? "bg-primary" : "bg-transparent"}`}
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-nav font-medium">{item.title}</span>
                  {item.body ? <span className="text-caption text-muted-foreground">{item.body}</span> : null}
                  {item.time ? <span className="text-caption text-muted-foreground">{item.time}</span> : null}
                  {item.unread ? <span className="sr-only">•</span> : null}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Popover>
  );
}
