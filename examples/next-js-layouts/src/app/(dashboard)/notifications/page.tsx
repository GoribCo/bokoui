import { Text } from "bokoui/react";
import { StaticPage } from "@/components/layout/static-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Notifications", path: "/notifications" });

export default function NotificationsPage() {
  return (
    <StaticPage title="Notifications" description="The full notification list belongs to the host project.">
      <Text>Show filters, read state and history here.</Text>
    </StaticPage>
  );
}
