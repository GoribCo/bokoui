import { forbidden } from "next/navigation";
import { Text } from "bokoui/react";
import { StaticPage } from "@/components/layout/static-page";
import { getActivePermissions, getActiveRoles } from "@/lib/access/active-roles";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Access control", path: "/admin" });

/**
 * Role-restricted page. The check runs on the server, so hiding the menu item is not the only protection:
 * opening the URL without the role returns the 403 view (FR-10.4).
 */
export default async function AdminPage() {
  const [roles, permissions] = await Promise.all([getActiveRoles(), getActivePermissions()]);
  if (!permissions.includes("organization.access.view")) forbidden();

  return (
    <StaticPage title="Access control" description="Visible to the admin and auditor roles in the active organization.">
      <Text>Your roles here: {roles.join(", ")}.</Text>
    </StaticPage>
  );
}
