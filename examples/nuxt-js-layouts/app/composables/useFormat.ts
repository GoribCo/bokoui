const tags = { en: 'en-US', bn: 'bn-BD' } as const

/** Locale-aware number and date formatting for the active language. */
export function useFormat() {
  const locale = useLocale()
  return {
    number: (n: number) => new Intl.NumberFormat(tags[locale.value]).format(n),
    date: (iso: string) => new Intl.DateTimeFormat(tags[locale.value], { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(iso)),
  }
}
