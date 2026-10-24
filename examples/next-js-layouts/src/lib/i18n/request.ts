import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { LOCALE_COOKIE, defaultLocale, isLocale } from "./config";
import { loadMessages } from "./messages";

/** Locale comes from a cookie, never from the URL (FR-13.5). */
export default getRequestConfig(async () => {
  const cookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookie) ? cookie : defaultLocale;
  return { locale, messages: await loadMessages(locale) };
});
