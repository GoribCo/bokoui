import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { MenuTranslator } from "@/lib/menu";

/** Adapts i18next's `t` to the string-key translator the menu helpers use (label keys come from data). */
export function useMenuTranslator(): MenuTranslator {
  const { t, i18n } = useTranslation();
  return useMemo(() => {
    const translate = (key: string): string => t(key);
    return Object.assign(translate, { has: (key: string) => i18n.exists(key) });
  }, [t, i18n]);
}
