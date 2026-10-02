import type { LocaleCode } from "./config";
import bn from "./messages/bn.json";
import en from "./messages/en.json";

export type Messages = typeof en;

/** One catalog per locale; adding a language means one message file plus one entry here and in `config.ts`. */
export const messages: Record<LocaleCode, Messages> = { en, bn };
