"use client";

import { Alert, Badge, Button, Card, Skeleton, Text } from "bokoui/react";
import { useMarkNotificationsRead, useNotifications } from "@/hooks/use-notifications";

/** Full list for the notifications page, with the same read state as the header panel (one query cache). */
export function NotificationList() {
  const notifications = useNotifications();
  const markRead = useMarkNotificationsRead();

  if (notifications.isPending) return <Skeleton className="h-40 w-full" aria-busy="true" />;
  if (notifications.isError) return <Alert action="danger">{notifications.error.message}</Alert>;

  const unread = notifications.data.filter((item) => item.unread).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <Text muted>{unread} unread</Text>
        <Button size="sm" variant="outline" disabled={unread === 0} onClick={() => markRead.mutate(undefined)}>
          Mark all as read
        </Button>
      </div>
      <Card className="p-0">
        <ul className="divide-y divide-border">
          {notifications.data.map((item) => (
            <li key={item.id} className="flex flex-col gap-1 px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className={item.unread ? "font-semibold" : "font-medium"}>{item.title}</span>
                <span className="text-caption text-muted-foreground tabular-nums">{item.time}</span>
              </div>
              <Text muted>{item.body}</Text>
              <div className="flex gap-2">
                {item.urgent ? <Badge action="danger">Urgent</Badge> : null}
                {item.kind === "invitation" ? <Badge color="neutral">Invitation</Badge> : null}
                {item.unread ? (
                  <Button size="sm" variant="ghost" onClick={() => markRead.mutate([item.id])}>
                    Mark as read
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
