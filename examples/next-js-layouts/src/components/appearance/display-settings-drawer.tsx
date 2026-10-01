"use client";

import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Button } from "bokoui/react";
import { Drawer, Tooltip } from "bokoui/react/client";
import { FontSizeControl } from "./font-size-control";
import { FontSwitcher } from "./font-switcher";
import { LanguageChips } from "./language-chips";
import { StyleSwitcher } from "./style-switcher";
import { ThemeModeControl } from "./theme-mode-control";

export interface DisplaySettingsDrawerProps {
  /** Include the design-style picker (see `config/features.ts`). */
  styleSwitcher?: boolean;
  /** Include the font family picker (see `config/features.ts`). */
  fontSwitcher?: boolean;
  /** Target of the "All settings" row; the row is hidden when unset. */
  allSettingsHref?: string;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-caption font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
      <div className="flex flex-col gap-4 rounded-surface border border-border bg-surface p-3">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-nav font-medium">{label}</span>
      {children}
    </div>
  );
}

/**
 * Header button that opens a right-hand panel with the display choices: theme mode, text size, optional
 * style and font, language (FR-7.2, FR-7.5). Each control persists itself and applies without a reload.
 */
export function DisplaySettingsDrawer({
  styleSwitcher = false,
  fontSwitcher = false,
  allSettingsHref,
}: DisplaySettingsDrawerProps) {
  const t = useTranslations("displaySettings");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip content={t("open")}>
        <Button
          variant="outline"
          color="neutral"
          iconOnly
          className="rounded-full"
          aria-label={t("open")}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <SlidersHorizontal aria-hidden="true" />
        </Button>
      </Tooltip>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="right"
        size="sm"
        title={t("title")}
        description={t("description")}
        closeLabel={t("close")}
        // The app frame is capped at --shell-max-width and centered; keep the panel inside it on wide screens.
        style={{ marginInlineEnd: "max(0px, calc((100% - var(--shell-max-width)) / 2))" }}
      >
        {open ? (
          <div className="flex flex-col gap-5">
            <Section title={t("appearance")}>
              <Row label={t("theme")}>
                <ThemeModeControl />
              </Row>
              <Row label={t("fontSize")}>
                <FontSizeControl />
              </Row>
              {styleSwitcher ? (
                <Row label={t("style")}>
                  <div className="[&_select]:h-9 [&_select]:w-full">
                    <StyleSwitcher showLabel={false} />
                  </div>
                </Row>
              ) : null}
              {fontSwitcher ? (
                <Row label={t("font")}>
                  <div className="[&_select]:h-9 [&_select]:w-full">
                    <FontSwitcher showLabel={false} />
                  </div>
                </Row>
              ) : null}
            </Section>
            <Section title={t("language")}>
              <Row label={t("languageHint")}>
                <LanguageChips />
              </Row>
            </Section>
            {allSettingsHref ? (
              <Link
                href={allSettingsHref}
                prefetch={false}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-control border border-border px-3 py-2 text-nav font-medium hover:bg-muted focus-ring"
              >
                {t("all")}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
