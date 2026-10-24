"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "bokoui/react/theme";

export interface StyleSwitcherProps {
  /** Show the label text next to the select (the compact header variant hides it). */
  showLabel?: boolean;
}

/** Picks one of the bokoui design styles, built-in and custom (FR-7.2). */
export function StyleSwitcher({ showLabel = true }: StyleSwitcherProps) {
  const t = useTranslations("appearance");
  const { style, themes, setStyle } = useTheme();

  return (
    <label className="flex items-center gap-2 text-nav">
      <span className={showLabel ? "text-muted-foreground" : "sr-only"}>{t("style")}</span>
      <select
        value={style}
        onChange={(event) => setStyle(event.target.value)}
        className="focus-ring h-8 min-w-0 rounded-control border-[length:var(--bokoui-border-width)] border-field-border bg-field px-2 text-nav text-foreground"
      >
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.label}
          </option>
        ))}
      </select>
    </label>
  );
}
