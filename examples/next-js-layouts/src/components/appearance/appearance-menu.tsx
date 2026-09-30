"use client";

import { Palette } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "bokoui/react";
import { Popover } from "bokoui/react/client";
import { FontSwitcher } from "./font-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { StyleSwitcher } from "./style-switcher";
import { ThemeModeToggle } from "./theme-mode-toggle";

export interface AppearanceMenuProps {
  /** Include the font picker (see `config/features.ts`). */
  fontSwitcher?: boolean;
}

/**
 * Theme mode, design style, language and optional font in one place: inline in the header from `lg`,
 * a compact popover below that (FR-7.2, FR-7.5).
 */
export function AppearanceMenu({ fontSwitcher = false }: AppearanceMenuProps) {
  const t = useTranslations("appearance");

  return (
    <>
      <div className="hidden items-center gap-3 lg:flex">
        <ThemeModeToggle />
        <StyleSwitcher showLabel={false} />
        <LanguageSwitcher showLabel={false} />
        {fontSwitcher ? <FontSwitcher showLabel={false} /> : null}
      </div>
      <div className="lg:hidden">
        <Popover
          placement="bottom-end"
          aria-label={t("title")}
          className="w-[min(18rem,calc(100vw-1.5rem))]"
          trigger={
            <Button variant="ghost" color="neutral" iconOnly aria-label={t("title")}>
              <Palette aria-hidden="true" />
            </Button>
          }
        >
          <div className="flex flex-col gap-3 p-2">
            <div className="flex items-center justify-between gap-3 text-nav">
              <span className="text-muted-foreground">{t("mode")}</span>
              <ThemeModeToggle />
            </div>
            <StyleSwitcher />
            <LanguageSwitcher />
            {fontSwitcher ? <FontSwitcher /> : null}
          </div>
        </Popover>
      </div>
    </>
  );
}
