"use client";

import { BaseQuery } from "@/lib/query/base-query";
import { queryKeys } from "@/lib/query/keys";
import { NotificationService } from "@/lib/services/notification.service";
import type { Notification } from "@/lib/types";

class NotificationsQuery extends BaseQuery {
  private readonly service = new NotificationService();

  list() {
    return this.useQuery({
      queryKey: queryKeys.notifications,
      queryFn: () => this.service.list(),
      refetchInterval: 60 * 1000,
      staleTime: 30 * 1000,
    });
  }

  markRead() {
    const queryClient = this.useQueryClient();
    return this.useMutation({
      mutationFn: (ids?: string[]) => this.service.markRead(ids),
      onMutate: async (ids) => {
        await queryClient.cancelQueries({ queryKey: queryKeys.notifications });
        const previous = queryClient.getQueryData<Notification[]>(queryKeys.notifications);
        queryClient.setQueryData<Notification[]>(queryKeys.notifications, (items) =>
          items?.map((item) => (!ids || ids.includes(item.id) ? { ...item, unread: false } : item)),
        );
        return { previous };
      },
      onError: (_error, _ids, context) => {
        if (context?.previous) queryClient.setQueryData(queryKeys.notifications, context.previous);
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications }),
    });
  }
}

const notificationsQuery = new NotificationsQuery();

/** Notifications of the signed-in user. Refetched on a timer so new ones appear without a reload. */
export function useNotifications() {
  return notificationsQuery.list();
}

/** Marks notifications read (all when `ids` is omitted). The list updates at once and rolls back on failure. */
export function useMarkNotificationsRead() {
  return notificationsQuery.markRead();
}
