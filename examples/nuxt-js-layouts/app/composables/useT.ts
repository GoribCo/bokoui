import enBase from '~/i18n/en.json'
import bnBase from '~/i18n/bn.json'
import en from '~/i18n/en'
import bn from '~/i18n/bn'
import type { Locale } from '~/utils/types'

export const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'bn', label: 'বাংলা' },
]
type Node = { [key: string]: Node | string }
/** `over` wins; both are nested dictionaries. */
const merge = (base: Node, over: Node): Node => {
  const out: Node = { ...base }
  for (const [k, v] of Object.entries(over)) out[k] = typeof v === 'object' && typeof out[k] === 'object' ? merge(out[k] as Node, v) : v
  return out
}
// The shared catalogs (copied from the Next.js example) first, the shell's own keys on top.
const catalogs: Record<Locale, unknown> = { en: merge(enBase as Node, en as Node), bn: merge(bnBase as Node, bn as Node) }

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
    // A key missing in the active language falls back to English.
    const found = key ? (lookup(catalogs[locale.value], key) ?? lookup(catalogs.en, key)) : undefined
    const text = typeof found === 'string' ? found : fallback
    return text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? `{${name}}`)
  }
}
