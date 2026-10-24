import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18next, { changeLanguage, use } from "i18next";
import { initReactI18next } from "react-i18next";
import { LOCALE_STORAGE_KEY, defaultLocale, isLocale, type LocaleCode } from "./config";
import { messages } from "./messages";

/** First-run language: the device's preferred language when the app supports it, otherwise the default. */
export function deviceLocale(): LocaleCode {
  const code = getLocales()[0]?.languageCode ?? undefined;
  return isLocale(code) ? code : defaultLocale;
}

async function savedLocale(): Promise<LocaleCode | undefined> {
  try {
    const value = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value ?? undefined) ? (value as LocaleCode) : undefined;
  } catch {
    return undefined;
  }
}

let ready: Promise<LocaleCode> | undefined;

/** Initializes i18next once with the saved (else device) language. The splash gate waits for it. */
export function initI18n(): Promise<LocaleCode> {
  ready ??= (async () => {
    const locale = (await savedLocale()) ?? deviceLocale();
    await use(initReactI18next).init({
      resources: { en: { translation: messages.en }, bn: { translation: messages.bn } },
      lng: locale,
      fallbackLng: defaultLocale,
      interpolation: { escapeValue: false },
      returnNull: false,
    });
    return locale;
  })();
  return ready;
}

/** Switches the language at once and remembers the choice. */
export async function setLocale(locale: LocaleCode): Promise<void> {
  await changeLanguage(locale);
  try {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // The language still changed for this session; only the memory of it is lost.
  }
}

export { i18next as i18n };
