import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { NotificationList } from "@/components/layout/notification-list";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Notifications", path: "/notifications" });

export default function NotificationsPage() {
  return (
    <PageContainer size="md">
      <PageHeader title="Notifications" description="Everything sent to you, newest first." />
      <NotificationList />
    </PageContainer>
  );
}
