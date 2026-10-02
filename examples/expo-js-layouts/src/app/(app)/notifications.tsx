import { Skeleton } from "bokoui/expo";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { NotificationList } from "@/components/layout/notification-list";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { QueryError } from "@/components/layout/query-error";
import { useScreenTitle } from "@/components/layout/screen-title";
import { useNavigate } from "@/hooks/use-navigate";
import { useNotificationLabels } from "@/hooks/use-notification-labels";
import { useMarkNotificationsRead, useNotifications } from "@/hooks/use-notifications";

/** Full list, with the same read state as the header panel (one query cache). */
export default function NotificationsScreen() {
  const { t } = useTranslation();
  const labels = useNotificationLabels();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const markRead = useMarkNotificationsRead();
  useScreenTitle(t("pages.notificationsTitle"));

  return (
    <PageContainer size="md">
      <PageHeader title={t("pages.notificationsTitle")} description={t("pages.notificationsDescription")} />
      {notifications.isPending ? (
        <View accessibilityState={{ busy: true }}>
          <Skeleton shape="rect" height={160} />
        </View>
      ) : notifications.isError ? (
        <QueryError error={notifications.error} onRetry={() => void notifications.refetch()} />
      ) : (
        <NotificationList items={notifications.data} labels={labels} onMarkRead={(ids) => markRead.mutate(ids)} onOpen={navigate} />
      )}
    </PageContainer>
  );
}
