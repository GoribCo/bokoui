import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buttonClass } from "bokoui/core";
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
        <Link href={DASHBOARD_PATH} data-tone="primary" className={buttonClass({ variant: "outline" })}>
          {t("backHome")}
        </Link>
      }
    />
  );
}
