import type { LocaleCode } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";

declare module "next-intl" {
  interface AppConfig {
    Locale: LocaleCode;
    Messages: Messages;
  }
}
