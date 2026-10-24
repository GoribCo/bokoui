import type { MenuGroup, MenuItem } from "@/lib/types";

/** Minimal translator shape; i18next's `t` fits through `useMenuTranslator`. */
export interface MenuTranslator {
  has(key: string): boolean;
  (key: string): string;
}

/** Translated label when the key exists in the catalog, the fallback label otherwise (FR-4.6). */
export function resolveLabel(entry: { label: string; labelKey?: string }, t: MenuTranslator): string {
  return entry.labelKey && t.has(entry.labelKey) ? t(entry.labelKey) : entry.label;
}

function localizeItems(items: MenuItem[], t: MenuTranslator): MenuItem[] {
  return items.map((item) => ({
    ...item,
    label: resolveLabel(item, t),
    children: item.children ? localizeItems(item.children, t) : undefined,
  }));
}

/** Returns the menu with every `label` resolved, so client components need no catalog lookups. */
export function localizeMenu(groups: MenuGroup[], t: MenuTranslator): MenuGroup[] {
  return groups.map((group) => ({
    ...group,
    label: resolveLabel(group, t),
    items: localizeItems(group.items, t),
  }));
}
