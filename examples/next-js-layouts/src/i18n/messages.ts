import type { LocaleCode } from "./config";
import en from "./messages/en.json";

export type Messages = typeof en;

/** One loader per locale; adding a language means one message file plus one entry here. */
const loaders: Record<LocaleCode, () => Promise<{ default: Messages }>> = {
  en: () => import("./messages/en.json"),
  bn: () => import("./messages/bn.json"),
};

export async function loadMessages(locale: LocaleCode): Promise<Messages> {
  return (await loaders[locale]()).default;
}
