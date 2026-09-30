/** Supported locales: the single list to extend when adding a language (plus one message file). */
export const locales = ["en", "bn"] as const;

export type LocaleCode = (typeof locales)[number];

export const defaultLocale: LocaleCode = "en";

/** Cookie that stores the chosen locale (no locale in the URL). */
export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined): value is LocaleCode {
  return locales.some((locale) => locale === value);
}
