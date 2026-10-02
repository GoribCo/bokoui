import { useTranslation } from "react-i18next";
import { StaticPage } from "@/components/layout/static-page";
import { useSession } from "@/providers/session-provider";

export default function AccountScreen() {
  const { t } = useTranslation();
  const { user } = useSession();
  return (
    <StaticPage title={t("pages.accountTitle")} description={t("pages.accountDescription")}>
      {t("pages.signedInAs", { name: user.name, email: user.email })}
    </StaticPage>
  );
}
