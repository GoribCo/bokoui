"use client";

import { useTranslations } from "next-intl";
import type { MenuTranslator } from "@/lib/menu";

/** Adapts next-intl's strictly typed `t` to the string-key translator the menu helpers use. */
export function useMenuTranslator(): MenuTranslator {
  // Menu label keys come from data, so they cannot be checked against the catalog at compile time.
  return useTranslations() as unknown as MenuTranslator;
}
