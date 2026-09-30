import { getTranslations } from "next-intl/server";
import type { MenuTranslator } from "@/lib/menu";

/** Server-side counterpart of `useMenuTranslator`: resolves data-driven label keys in Server Components. */
export async function getMenuTranslator(): Promise<MenuTranslator> {
  // Label keys come from data, so they cannot be checked against the catalog at compile time.
  return (await getTranslations()) as unknown as MenuTranslator;
}
