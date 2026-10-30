import en from '~/i18n/en'
import bn from '~/i18n/bn'
import type { Locale } from '~/utils/types'

export const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'bn', label: 'বাংলা' },
]
const catalogs: Record<Locale, unknown> = { en, bn }

/** The locale lives in a cookie so the server renders the same language the browser shows. */
export const useLocale = () =>
  useCookie<Locale>('boko_locale', { default: () => 'en', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })

const lookup = (catalog: unknown, key: string) =>
  key.split('.').reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), catalog)

/** `t('shell.skip')`; `{name}` placeholders are filled from `vars`; `fallback` shows when the key is missing. */
export function useT() {
  const locale = useLocale()
  useHead({ htmlAttrs: { lang: locale } })
  return (key: string | undefined, fallback = key ?? '', vars: Record<string, string> = {}) => {
    const found = key ? lookup(catalogs[locale.value], key) : undefined
    const text = typeof found === 'string' ? found : fallback
    return text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? `{${name}}`)
  }
}
