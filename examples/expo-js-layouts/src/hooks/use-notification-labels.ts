import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { NotificationsButtonLabels } from "@/components/layout/notifications-button";

/** Translated labels of the notification list and its panel, shared by the header button and the screen. */
export function useNotificationLabels(): NotificationsButtonLabels {
  const { t } = useTranslation();
  return useMemo(
    () => ({
      title: t("shell.notifications"),
      empty: t("shell.noNotifications"),
      unread: (count: number) => t("shell.notificationsUnread", { count }),
      markAllRead: t("shell.markAllRead"),
      viewAll: t("shell.viewAllNotifications"),
      close: t("shell.close"),
      tabs: {
        all: t("shell.notificationTabs.all"),
        urgent: t("shell.notificationTabs.urgent"),
        invitations: t("shell.notificationTabs.invitations"),
      },
    }),
    [t],
  );
}
