"use client";

import { Bell, CircleHelp, Globe, Moon, Settings, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Avatar, Button, Card, Heading, Switch, Text } from "bokoui/react";
import { useTheme } from "bokoui/react/theme";
import { PageContainer } from "@/components/layout/page-container";
import { localeMeta, type LocaleCode } from "@/lib/i18n/config";
import { useSession } from "@/providers/session-provider";
import { IconTile } from "./icon-tile";
import { ListRow } from "./list-row";

/** Sample screen: profile row, switch rows (dark mode really switches the mode), navigation rows and a save button. */
export function ShowcaseSettings() {
  const t = useTranslations("showcase");
  const locale = useLocale() as LocaleCode;
  const { user } = useSession();
  const { resolvedMode, setMode } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <PageContainer size="md">
      <Heading as="h1" className="text-display">
        {t("settingsTitle")}
      </Heading>

      <Card padding="none" className="overflow-hidden">
        <ListRow icon={<Avatar name={user.name} src={user.avatarUrl} color="primary" />} title={user.name} subtitle={user.email} href="/profile" />
      </Card>

      <Card padding="none" className="divide-y divide-border overflow-hidden">
        <ListRow icon={<IconTile><Bell /></IconTile>} title={t("notifications")} end={<Switch aria-label={t("notifications")} checked={notifications} onChange={(event) => setNotifications(event.target.checked)} />} />
        <ListRow icon={<IconTile><Moon /></IconTile>} title={t("darkMode")} end={<Switch aria-label={t("darkMode")} checked={resolvedMode === "dark"} onChange={(event) => setMode(event.target.checked ? "dark" : "light")} />} />
        <ListRow icon={<IconTile><Globe /></IconTile>} title={t("language")} end={<Text muted className="text-nav">{localeMeta[locale].name}</Text>} />
      </Card>

      <Card padding="none" className="divide-y divide-border overflow-hidden">
        <ListRow icon={<IconTile><ShieldCheck /></IconTile>} title={t("privacy")} href="/settings/privacy" />
        <ListRow icon={<IconTile><Settings /></IconTile>} title={t("appSettings")} href="/account" />
        <ListRow icon={<IconTile><CircleHelp /></IconTile>} title={t("help")} href="/help" />
      </Card>

      <Button size="lg" fullWidth onClick={() => setSaved(true)}>
        {t("saveChanges")}
      </Button>
      <p role="status" className="min-h-5 text-center text-nav text-muted-foreground">
        {saved ? t("saved") : ""}
      </p>
    </PageContainer>
  );
}
