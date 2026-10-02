import { useMemo } from "react";
import type { FooterLink } from "@/lib/types";
import { useMenuTranslator } from "./use-menu-translator";

/** Footer links with their labels translated (the fallback label when a key has no translation). */
export function useFooterLinks(links: FooterLink[]): FooterLink[] {
  const translate = useMenuTranslator();
  return useMemo(
    () => links.map((link) => ({ ...link, label: link.labelKey && translate.has(link.labelKey) ? translate(link.labelKey) : link.label })),
    [links, translate],
  );
}
