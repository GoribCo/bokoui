import { useTranslation } from "react-i18next";
import { StaticPage } from "@/components/layout/static-page";

export default function HelpScreen() {
  const { t } = useTranslation();
  return (
    <StaticPage title={t("pages.helpTitle")} description={t("pages.helpDescription")}>
      {t("pages.helpBody")}
    </StaticPage>
  );
}
