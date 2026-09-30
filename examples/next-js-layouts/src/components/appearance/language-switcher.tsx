"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/i18n/actions";
import { locales } from "@/i18n/config";

export interface LanguageSwitcherProps {
  showLabel?: boolean;
}

/** Changes the locale cookie through a server action, then refreshes so Server Components re-render (FR-13.1). */
export function LanguageSwitcher({ showLabel = true }: LanguageSwitcherProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-nav">
      <span className={showLabel ? "text-muted-foreground" : "sr-only"}>{t("appearance.language")}</span>
      <select
        value={locale}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value;
          startTransition(async () => {
            await setLocale(next);
            router.refresh();
          });
        }}
        className="focus-ring h-8 min-w-0 rounded-control border-[length:var(--bokoui-border-width)] border-field-border bg-field px-2 text-nav text-foreground disabled:opacity-(--bokoui-disabled-opacity)"
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {t(`locale.${code}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
