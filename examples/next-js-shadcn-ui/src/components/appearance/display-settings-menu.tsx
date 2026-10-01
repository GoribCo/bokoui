"use client";

import { Palette } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FontSizeControl } from "./font-size-control";
import { LanguageChips } from "./language-chips";
import { ThemeModeControl } from "./theme-mode-control";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="px-1 text-caption text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

/**
 * Header button opening a compact popover with the display choices: theme mode, text size, language
 * (FR-7.2, FR-7.5). Each control persists itself and applies without a reload.
 */
export function DisplaySettingsMenu() {
  const t = useTranslations("displaySettings");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full" aria-label={t("title")}>
          <Palette aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" aria-label={t("title")} className="w-[min(20rem,calc(100vw-1.5rem))]">
        <div className="flex flex-col gap-3">
          <Row label={t("theme")}>
            <ThemeModeControl />
          </Row>
          <Row label={t("fontSize")}>
            <FontSizeControl />
          </Row>
          <Row label={t("language")}>
            <LanguageChips />
          </Row>
        </div>
      </PopoverContent>
    </Popover>
  );
}
