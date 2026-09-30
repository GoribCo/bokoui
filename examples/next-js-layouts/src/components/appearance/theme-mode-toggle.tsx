"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "bokoui/react";
import { useTheme, type ThemeMode } from "bokoui/react/theme";

const modeOptions: { mode: ThemeMode; icon: LucideIcon }[] = [
  { mode: "light", icon: Sun },
  { mode: "dark", icon: Moon },
  { mode: "system", icon: Monitor },
];

/** Light / dark / system. The choice persists and is applied before paint by `ThemeScript` (FR-7.2, FR-7.4). */
export function ThemeModeToggle() {
  const t = useTranslations("appearance");
  const { mode, setMode } = useTheme();

  return (
    <div role="group" aria-label={t("mode")} className="flex gap-1">
      {modeOptions.map(({ mode: option, icon: Icon }) => (
        <Button
          key={option}
          size="sm"
          color="neutral"
          variant={mode === option ? "solid" : "outline"}
          iconOnly
          aria-pressed={mode === option}
          aria-label={t(option)}
          title={t(option)}
          onClick={() => setMode(option)}
        >
          <Icon aria-hidden="true" />
        </Button>
      ))}
    </div>
  );
}
