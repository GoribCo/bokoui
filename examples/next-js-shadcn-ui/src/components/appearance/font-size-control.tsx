"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import {
  DEFAULT_FONT_SIZE,
  FONT_SIZE_STORAGE_KEY,
  fontSizes,
  type FontSize,
} from "@/lib/fonts/font-options";
import { SegmentedControl } from "./segmented-control";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-font-size"] });
  return () => observer.disconnect();
}
const getSnapshot = () => document.documentElement.dataset.fontSize ?? DEFAULT_FONT_SIZE;
const getServerSnapshot = () => DEFAULT_FONT_SIZE;

const labelKeys = { sm: "small", md: "medium", lg: "large" } as const satisfies Record<FontSize, string>;

/** Small / Medium / Large: sets `data-font-size` on `<html>` and remembers it. */
export function FontSizeControl() {
  const t = useTranslations("displaySettings");
  const size = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) as FontSize;

  const change = (next: FontSize) => {
    const root = document.documentElement;
    if (next === DEFAULT_FONT_SIZE) root.removeAttribute("data-font-size");
    else root.dataset.fontSize = next;
    try {
      if (next === DEFAULT_FONT_SIZE) localStorage.removeItem(FONT_SIZE_STORAGE_KEY);
      else localStorage.setItem(FONT_SIZE_STORAGE_KEY, next);
    } catch {
      // Storage can be blocked; the choice then lasts for this page view only.
    }
  };

  return (
    <SegmentedControl
      label={t("fontSize")}
      value={size}
      onChange={change}
      options={fontSizes.map((value) => ({ value, label: t(labelKeys[value]) }))}
    />
  );
}
