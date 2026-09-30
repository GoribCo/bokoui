"use client";

import { Bell } from "lucide-react";
import { Badge, Button } from "bokoui/react";

export interface NotificationsButtonProps {
  label: string;
  /** Unread count; the badge is hidden at 0. */
  count?: number;
  onClick?: () => void;
}

/** Bell with an unread count. Wire `onClick` to a panel or a page. */
export function NotificationsButton({ label, count = 0, onClick }: NotificationsButtonProps) {
  return (
    <span className="relative inline-flex">
      <Button
        variant="ghost"
        color="neutral"
        iconOnly
        aria-label={count > 0 ? `${label} (${count})` : label}
        onClick={onClick}
      >
        <Bell aria-hidden="true" />
      </Button>
      {count > 0 ? (
        <Badge size="sm" action="danger" aria-hidden="true" className="pointer-events-none absolute -end-1 -top-1">
          {count > 99 ? "99+" : count}
        </Badge>
      ) : null}
    </span>
  );
}
