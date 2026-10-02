import { useTranslation } from "react-i18next";
import { defaultLocale, isLocale, type LocaleCode } from "@/lib/i18n/config";

/** The active language; re-renders when it changes. */
export function useLocale(): LocaleCode {
  const { i18n } = useTranslation();
  return isLocale(i18n.language) ? i18n.language : defaultLocale;
}
