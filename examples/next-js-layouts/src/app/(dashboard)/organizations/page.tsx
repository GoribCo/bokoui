import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { OrganizationList } from "@/components/organization/organization-list";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Manage workspaces", path: "/organizations" });

export default function OrganizationsPage() {
  return (
    <PageContainer>
      <PageHeader title="Manage workspaces" description="Administration (add, rename, remove) belongs to the host project." />
      <OrganizationList />
    </PageContainer>
  );
}
