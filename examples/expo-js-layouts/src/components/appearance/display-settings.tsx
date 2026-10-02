import { Text } from "bokoui/expo/ui";
import { Drawer } from "bokoui/expo/blocks";
import { useTheme, type ThemeMode } from "bokoui/expo";
import { SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { IconButton } from "@/components/layout/icon-button";
import { useLocale } from "@/hooks/use-locale";
import { useSheetHeight } from "@/hooks/use-sheet-height";
import { features } from "@/lib/config/features";
import { localeMeta, locales } from "@/lib/i18n/config";
import { setLocale } from "@/lib/i18n";
import { SegmentedChips } from "./segmented-chips";

const modes: ThemeMode[] = ["light", "dark", "system"];

export interface DisplaySettingsProps {
  /** Show the design style picker; defaults to `features.styleSwitcher`. */
  styleSwitcher?: boolean;
}

/**
 * Header button that opens the display settings sheet: mode (light, dark, system), design style and language.
 * Changes apply at once and persist (the theme provider and the i18n module save them).
 */
export function DisplaySettings({ styleSwitcher = features.styleSwitcher }: DisplaySettingsProps) {
  const { t } = useTranslation();
  const { tokens, style, mode, themes, setStyle, setMode } = useTheme();
  const locale = useLocale();
  const maxHeight = useSheetHeight(140);
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        label={t("displaySettings.title")}
        icon={<SlidersHorizontal size={20} color={tokens.fg} />}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(true)}
      />
      <Drawer side="bottom" open={open} onOpenChange={setOpen} title={t("displaySettings.title")} closeLabel={t("shell.close")}>
        {open ? (
          <ScrollView style={{ maxHeight }} contentContainerStyle={{ gap: 20 }} keyboardShouldPersistTaps="handled">
            <View style={{ gap: 8 }}>
              <Text variant="small" muted>
                {t("displaySettings.theme")}
              </Text>
              <SegmentedChips
                label={t("displaySettings.theme")}
                value={mode}
                onChange={setMode}
                options={modes.map((value) => ({ value, label: t(`appearance.${value}`) }))}
              />
            </View>
            {styleSwitcher ? (
              <View style={{ gap: 8 }}>
                <Text variant="small" muted>
                  {t("displaySettings.style")}
                </Text>
                <SegmentedChips
                  scroll
                  label={t("displaySettings.style")}
                  value={style}
                  onChange={setStyle}
                  options={themes.map((theme) => ({ value: theme.id, label: theme.label }))}
                />
              </View>
            ) : null}
            <View style={{ gap: 8 }}>
              <Text variant="small" muted>
                {t("displaySettings.language")}
              </Text>
              <SegmentedChips
                label={t("displaySettings.language")}
                value={locale}
                onChange={(value) => void setLocale(value)}
                options={locales.map((value) => ({ value, label: `${localeMeta[value].flag} ${localeMeta[value].name}` }))}
              />
            </View>
          </ScrollView>
        ) : null}
      </Drawer>
    </>
  );
}
