"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { setLocale } from "@/lib/i18n/actions";
import { localeMeta, locales } from "@/lib/i18n/config";

/** One chip per locale with flag and native name. Sets the locale cookie, then refreshes Server Components (FR-13.1). */
export function LanguageChips() {
  const t = useTranslations("displaySettings");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div role="group" aria-label={t("language")} className="flex flex-wrap gap-2">
      {locales.map((code) => (
        <Button
          key={code}
          size="sm"
          variant={locale === code ? "default" : "outline"}
          aria-pressed={locale === code}
          disabled={pending}
          lang={code}
          onClick={() => {
            if (code === locale) return;
            startTransition(async () => {
              await setLocale(code);
              router.refresh();
            });
          }}
        >
          <span aria-hidden="true">{localeMeta[code].flag}</span>
          {localeMeta[code].name}
        </Button>
      ))}
    </div>
  );
}
