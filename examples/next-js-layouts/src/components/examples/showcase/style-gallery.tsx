"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button, Card, CardHeader, Heading } from "bokoui/react";
import { buttonClass } from "bokoui/core";
import { useTheme } from "bokoui/react/theme";
import type { ThemeMode } from "bokoui/core";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";

const modes: ThemeMode[] = ["light", "dark", "system"];

const samples = [
  { href: "/examples/showcase-home", titleKey: "homeTitle" },
  { href: "/examples/showcase-settings", titleKey: "settingsTitle" },
  { href: "/examples/showcase-calculator", titleKey: "calculatorTitle" },
  { href: "/dashboard", titleKey: "dashboard" },
] as const;

/** Every design style as a tile that switches to it at once, a mode switch, and links to the sample screens. */
export function StyleGallery() {
  const t = useTranslations("showcase");
  const tAppearance = useTranslations("appearance");
  const { style, mode, themes, setStyle, setMode } = useTheme();

  return (
    <PageContainer>
      <PageHeader title={t("galleryTitle")} description={t("galleryDescription")} />
      <div role="radiogroup" aria-label={tAppearance("mode")} className="flex flex-wrap gap-2">
        {modes.map((value) => (
          <Button key={value} size="sm" color="neutral" variant={mode === value ? "solid" : "soft"} role="radio" aria-checked={mode === value} onClick={() => setMode(value)}>
            {tAppearance(value)}
          </Button>
        ))}
      </div>

      <div role="radiogroup" aria-label={tAppearance("style")} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {themes.map((theme) => {
          const active = theme.id === style;
          return (
            <button key={theme.id} type="button" role="radio" aria-checked={active} onClick={() => setStyle(theme.id)} className="rounded-card text-start focus-ring">
              <Card padding="sm" className={`gap-2 ${active ? "ring-2 ring-primary" : ""}`}>
                <span aria-hidden="true" className="flex gap-1.5">
                  <span className="size-5 rounded-full bg-primary" />
                  <span className="size-5 rounded-full bg-secondary" />
                  <span className="size-5 rounded-full bg-accent" />
                </span>
                <span className="flex items-center justify-between gap-2">
                  <span className={`truncate ${active ? "font-bold" : "font-medium"}`}>{theme.label}</span>
                  {active ? <Check aria-hidden="true" className="size-4 text-primary" /> : null}
                </span>
              </Card>
            </button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <Heading as="h2" size="md">
            {t("samples")}
          </Heading>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          {samples.map((sample) => (
            <Link key={sample.href} href={sample.href} prefetch={false} data-tone="neutral" className={buttonClass({ variant: "soft", size: "sm" })}>
              {sample.titleKey === "dashboard" ? "Dashboard" : t(sample.titleKey)}
            </Link>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}
