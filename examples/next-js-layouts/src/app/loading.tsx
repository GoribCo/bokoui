import { getTranslations } from "next-intl/server";
import { Spinner } from "bokoui/react";

export default async function Loading() {
  const t = await getTranslations("errors");
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Spinner size="lg" aria-label={t("loading")} />
    </div>
  );
}
