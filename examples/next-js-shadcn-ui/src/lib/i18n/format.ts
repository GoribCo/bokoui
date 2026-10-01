import type { LocaleCode } from "@/lib/types";

type DateInput = Date | string | number;

const toDate = (value: DateInput) => (value instanceof Date ? value : new Date(value));

/** Locale-aware date, e.g. "14 Mar 2022" (en) or Bengali digits and month names (bn). */
export function formatDate(
  value: DateInput,
  locale: LocaleCode,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" },
): string {
  return new Intl.DateTimeFormat(locale, options).format(toDate(value));
}

export function formatDateTime(value: DateInput, locale: LocaleCode): string {
  return formatDate(value, locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatNumber(value: number, locale: LocaleCode, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(value: number, locale: LocaleCode, currency: string): string {
  return formatNumber(value, locale, { style: "currency", currency });
}

/** Plural category for ICU-style selection outside message catalogs. */
export function pluralCategory(count: number, locale: LocaleCode): Intl.LDMLPluralRule {
  return new Intl.PluralRules(locale).select(count);
}
