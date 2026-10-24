import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { DASHBOARD_PATH } from "@/lib/config/auth";
import { StatusView } from "@/components/layout/status-view";

/** Shown (with status 403) when a page calls `forbidden()`; rendered inside the shell. */
export default async function Forbidden() {
  const t = await getTranslations("errors");
  return (
    <StatusView
      code="403"
      title={t("forbiddenTitle")}
      description={t("forbiddenBody")}
      actions={
        <Button asChild variant="outline">
          <Link href={DASHBOARD_PATH}>{t("backHome")}</Link>
        </Button>
      }
    />
  );
}
