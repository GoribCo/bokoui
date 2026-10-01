import { getTranslations } from "next-intl/server";
import { Spinner } from "bokoui/react";

export default async function AuthLoading() {
  const t = await getTranslations("errors");
  return <Spinner size="lg" aria-label={t("loading")} />;
}
