import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { useScreenTitle } from "@/components/layout/screen-title";
import { OrganizationList } from "@/components/organization/organization-list";

export default function OrganizationsScreen() {
  const { t } = useTranslation();
  useScreenTitle(t("pages.organizationsTitle"));
  return (
    <PageContainer>
      <PageHeader title={t("pages.organizationsTitle")} description={t("pages.organizationsDescription")} />
      <OrganizationList />
    </PageContainer>
  );
}
