import { getTranslations } from "next-intl/server";
import { Spinner } from "bokoui/react";

/** Shown inside the public layout while a page loads; the header and footer stay in place. */
export default async function PublicLoading() {
  const t = await getTranslations("errors");
  return (
    <div className="flex min-h-[60dvh] items-center justify-center">
      <Spinner size="lg" aria-label={t("loading")} />
    </div>
  );
}
