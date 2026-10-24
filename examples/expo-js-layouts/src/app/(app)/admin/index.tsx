import { useTranslation } from "react-i18next";
import { StaticPage } from "@/components/layout/static-page";
import { useActiveOrganization } from "@/hooks/use-active-organization";

export default function AdminScreen() {
  const { t } = useTranslation();
  const { roles } = useActiveOrganization();
  return (
    <StaticPage title={t("pages.adminTitle")} description={t("pages.adminDescription")}>
      {t("pages.adminRoles", { roles: roles.join(", ") })}
    </StaticPage>
  );
}
