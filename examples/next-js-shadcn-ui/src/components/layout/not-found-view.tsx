import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
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
        <Button asChild variant="outline">
          <Link href="/">{t("backHome")}</Link>
        </Button>
      }
    />
  );
}
