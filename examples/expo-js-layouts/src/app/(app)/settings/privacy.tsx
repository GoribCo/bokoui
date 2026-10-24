import { useTranslation } from "react-i18next";
import { StaticPage } from "@/components/layout/static-page";

export default function PrivacySettingsScreen() {
  const { t } = useTranslation();
  return (
    <StaticPage title={t("pages.privacyTitle")} description={t("pages.privacyDescription")}>
      {t("pages.privacyBody")}
    </StaticPage>
  );
}
