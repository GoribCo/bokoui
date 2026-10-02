import { Button } from "bokoui/expo";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { toRoute } from "@/lib/menu";
import { useScreenTitle } from "./screen-title";
import { StatusView } from "./status-view";

/** Content of the not-found screens (root and inside the shell). */
export function NotFoundView() {
  const { t } = useTranslation();
  const router = useRouter();
  useScreenTitle(t("errors.notFoundTitle"));
  return (
    <StatusView
      code="404"
      title={t("errors.notFoundTitle")}
      description={t("errors.notFoundBody")}
      actions={
        <Button variant="outline" onPress={() => router.replace(toRoute("/"))}>
          {t("errors.backHome")}
        </Button>
      }
    />
  );
}
