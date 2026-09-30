"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { DEFAULT_FONT_ID, FONT_STORAGE_KEY, fontOptions } from "@/lib/font-options";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-font"] });
  return () => observer.disconnect();
}
const getSnapshot = () => document.documentElement.dataset.font ?? DEFAULT_FONT_ID;
const getServerSnapshot = () => DEFAULT_FONT_ID;

export interface FontSwitcherProps {
  showLabel?: boolean;
}

/** Optional font picker: sets `data-font` on `<html>` and remembers it (enable in `config/features.ts`). */
export function FontSwitcher({ showLabel = true }: FontSwitcherProps) {
  const t = useTranslations("appearance");
  const font = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const change = (id: string) => {
    const root = document.documentElement;
    if (id === DEFAULT_FONT_ID) root.removeAttribute("data-font");
    else root.dataset.font = id;
    try {
      if (id === DEFAULT_FONT_ID) localStorage.removeItem(FONT_STORAGE_KEY);
      else localStorage.setItem(FONT_STORAGE_KEY, id);
    } catch {
      // Storage can be blocked; the choice then lasts for this page view only.
    }
  };

  return (
    <label className="flex items-center gap-2 text-nav">
      <span className={showLabel ? "text-muted-foreground" : "sr-only"}>{t("font")}</span>
      <select
        value={font}
        onChange={(event) => change(event.target.value)}
        className="focus-ring h-8 min-w-0 rounded-control border-[length:var(--bokoui-border-width)] border-field-border bg-field px-2 text-nav text-foreground"
      >
        {fontOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.id === DEFAULT_FONT_ID ? t("fontDefault") : option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
