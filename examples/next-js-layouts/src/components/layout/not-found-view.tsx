import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buttonClass } from "bokoui/core";
import { StatusView } from "./status-view";

/** Content of the 404 pages (global and inside the shell). */
export async function NotFoundView() {
  const t = await getTranslations("errors");
  return (
    <StatusView
      code="404"
      title={t("notFoundTitle")}
      description={t("notFoundBody")}
      actions={
        <Link
          href="/"
          data-tone="primary"
          className={buttonClass({ variant: "outline" })}
        >
          {t("backHome")}
        </Link>
      }
    />
  );
}
