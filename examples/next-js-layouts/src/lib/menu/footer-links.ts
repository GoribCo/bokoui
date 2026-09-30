import type { FooterLink, MenuItem } from "@/types";

/** Reuses menu items (e.g. the common menu) as footer links: only items with a href qualify (FR-8.2). */
export function menuItemsToFooterLinks(items: MenuItem[]): FooterLink[] {
  return items.flatMap((item) =>
    item.href ? [{ id: item.id, label: item.label, labelKey: item.labelKey, href: item.href }] : [],
  );
}
