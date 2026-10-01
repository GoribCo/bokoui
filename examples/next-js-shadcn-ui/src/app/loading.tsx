import { getTranslations } from "next-intl/server";
import { Spinner } from "@/components/ui/spinner";

export default async function Loading() {
  const t = await getTranslations("errors");
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <Spinner className="size-8" aria-label={t("loading")} />
    </div>
  );
}
