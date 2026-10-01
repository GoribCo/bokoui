import { Text } from "bokoui/react";
import { StaticPage } from "@/components/layout/static-page";
import { getSession } from "@/lib/session/session";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Manage workspaces", path: "/organizations" });

export default async function OrganizationsPage() {
  const session = await getSession();
  return (
    <StaticPage title="Manage workspaces" description="Workspace administration belongs to the host project.">
      <Text>Signed in as {session?.user.email}. Add, rename and remove workspaces here.</Text>
    </StaticPage>
  );
}
