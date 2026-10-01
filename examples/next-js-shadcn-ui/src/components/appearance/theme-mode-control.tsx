"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { SegmentedControl } from "./segmented-control";

type ThemeMode = "system" | "light" | "dark";
const modes: ThemeMode[] = ["system", "light", "dark"];

const subscribe = () => () => {};

/** System / Light / Dark with text labels; next-themes persists the choice and applies it before paint. */
export function ThemeModeControl() {
  const t = useTranslations("appearance");
  const { theme, setTheme } = useTheme();
  // The stored theme is unknown on the server; show "system" until the client has mounted.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <SegmentedControl
      label={t("mode")}
      value={mounted && (theme === "light" || theme === "dark") ? theme : "system"}
      onChange={setTheme}
      options={modes.map((value) => ({ value, label: t(value) }))}
    />
  );
}
