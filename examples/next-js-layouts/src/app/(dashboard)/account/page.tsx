import { Text } from "bokoui/react";
import { StaticPage } from "@/components/layout/static-page";
import { getSession } from "@/lib/session/session";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Manage account", path: "/account" });

export default async function AccountPage() {
  const session = await getSession();
  return (
    <StaticPage title="Manage account" description="Account settings belong to the host project.">
      <Text>
        Signed in as {session?.user.name} ({session?.user.email}).
      </Text>
    </StaticPage>
  );
}
