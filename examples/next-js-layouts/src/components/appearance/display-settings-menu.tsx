"use client";

import { Palette } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "bokoui/react";
import { Popover } from "bokoui/react/client";
import { FontSizeControl } from "./font-size-control";
import { FontSwitcher } from "./font-switcher";
import { LanguageChips } from "./language-chips";
import { StyleSwitcher } from "./style-switcher";
import { ThemeModeControl } from "./theme-mode-control";

export interface DisplaySettingsMenuProps {
  /** Include the design-style picker (see `config/features.ts`). */
  styleSwitcher?: boolean;
  /** Include the font family picker (see `config/features.ts`). */
  fontSwitcher?: boolean;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="px-1 text-caption text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

/**
 * Alternative to `DisplaySettingsDrawer`: the same controls in a compact dropdown under the header
 * button, like the workspace switcher. Both exist so the two patterns can be compared.
 */
export function DisplaySettingsMenu({ styleSwitcher = false, fontSwitcher = false }: DisplaySettingsMenuProps) {
  const t = useTranslations("displaySettings");

  return (
    <Popover
      placement="bottom-end"
      aria-label={t("quick")}
      className="w-[min(20rem,calc(100vw-1.5rem))] p-2"
      trigger={
        <Button variant="outline" color="neutral" iconOnly className="rounded-full" aria-label={t("quick")} aria-haspopup="dialog">
          <Palette aria-hidden="true" />
        </Button>
      }
    >
      <div className="flex flex-col gap-3 p-1">
        <Row label={t("theme")}>
          <ThemeModeControl />
        </Row>
        {styleSwitcher ? (
          <Row label={t("style")}>
            <div className="[&_select]:h-9 [&_select]:w-full">
              <StyleSwitcher showLabel={false} />
            </div>
          </Row>
        ) : null}
        <Row label={t("fontSize")}>
          <FontSizeControl />
        </Row>
        {fontSwitcher ? (
          <Row label={t("font")}>
            <div className="[&_select]:h-9 [&_select]:w-full">
              <FontSwitcher showLabel={false} />
            </div>
          </Row>
        ) : null}
        <Row label={t("language")}>
          <LanguageChips />
        </Row>
      </div>
    </Popover>
  );
}
