"use client";

import { useTranslations } from "next-intl";
import { useTheme, type ThemeMode } from "bokoui/react/theme";
import { SegmentedControl } from "./segmented-control";

const modes: ThemeMode[] = ["system", "light", "dark"];

/** System / Light / Dark with text labels, for the display settings drawer. */
export function ThemeModeControl() {
  const t = useTranslations("appearance");
  const { mode, setMode } = useTheme();

  return (
    <SegmentedControl
      label={t("mode")}
      value={mode}
      onChange={setMode}
      options={modes.map((value) => ({ value, label: t(value) }))}
    />
  );
}
