"use client";

import { useMutation, useQuery, useQueryClient } from "@/lib/query/react-query";
import { queryKeys } from "@/lib/query/keys";
import { services } from "@/lib/services";
import type { Notification } from "@/lib/types";

/** Notifications of the signed-in user. Refetched on a timer so new ones appear without a reload. */
export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => services.notifications.list(),
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
  });
}

/** Marks notifications read (all when `ids` is omitted). The list updates at once and rolls back on failure. */
export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids?: string[]) => services.notifications.markRead(ids),
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
