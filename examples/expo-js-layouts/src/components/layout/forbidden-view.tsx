import { Button } from "bokoui/expo/ui";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { DASHBOARD_PATH } from "@/lib/config/auth";
import { toRoute } from "@/lib/menu";
import { StatusView } from "./status-view";

/** Shown in place of a screen the user's roles do not allow (403). */
export function ForbiddenView() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <StatusView
      code="403"
      title={t("errors.forbiddenTitle")}
      description={t("errors.forbiddenBody")}
      actions={
        <Button variant="outline" onPress={() => router.replace(toRoute(DASHBOARD_PATH))}>
          {t("errors.backHome")}
        </Button>
      }
    />
  );
}
