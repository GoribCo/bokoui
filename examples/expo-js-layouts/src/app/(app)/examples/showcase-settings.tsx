import { Avatar, Button, Card, Heading, Switch, Text, useToast } from "bokoui/expo/ui";
import { useTheme } from "bokoui/expo";
import { Bell, CircleHelp, Globe, Moon, Settings, ShieldCheck } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ListRow } from "@/components/examples/list-row";
import { PageContainer } from "@/components/layout/page-container";
import { useScreenTitle } from "@/components/layout/screen-title";
import { useLocale } from "@/hooks/use-locale";
import { localeMeta } from "@/lib/i18n/config";
import { useSession } from "@/providers/session-provider";

/** Sample screen: profile row, switch rows (dark mode really switches the mode), navigation rows and a save button. */
export default function ShowcaseSettingsScreen() {
  const { t } = useTranslation();
  const { tokens, resolvedMode, setMode } = useTheme();
  const { toast } = useToast();
  const { user } = useSession();
  const locale = useLocale();
  const [notifications, setNotifications] = useState(true);
  useScreenTitle(t("showcase.settingsTitle"));
  const icon = (Icon: typeof Bell) => <Icon size={20} color={tokens.primary} />;

  return (
    <PageContainer size="md">
      <Heading as="h1" size="3xl">
        {t("showcase.settingsTitle")}
      </Heading>

      <Card padding="none" style={{ gap: 0, overflow: "hidden" }}>
        <ListRow icon={<Avatar name={user.name} src={user.avatarUrl} color="primary" />} title={user.name} subtitle={user.email} onPress={() => undefined} />
      </Card>

      <Card padding="none" style={{ gap: 0, overflow: "hidden" }}>
        <ListRow icon={icon(Bell)} title={t("showcase.notifications")} end={<Switch hideLabel checked={notifications} onCheckedChange={setNotifications} label={t("showcase.notifications")} />} />
        <ListRow icon={icon(Moon)} title={t("showcase.darkMode")} end={<Switch hideLabel checked={resolvedMode === "dark"} onCheckedChange={(on) => setMode(on ? "dark" : "light")} label={t("showcase.darkMode")} />} />
        <ListRow
          icon={icon(Globe)}
          title={t("showcase.language")}
          end={
            <Text variant="small" muted>
              {localeMeta[locale].name}
            </Text>
          }
        />
      </Card>

      <Card padding="none" style={{ gap: 0, overflow: "hidden" }}>
        <ListRow icon={icon(ShieldCheck)} title={t("showcase.privacy")} onPress={() => undefined} />
        <ListRow icon={icon(Settings)} title={t("showcase.appSettings")} onPress={() => undefined} />
        <ListRow icon={icon(CircleHelp)} title={t("showcase.help")} onPress={() => undefined} />
      </Card>

      <View>
        <Button fullWidth size="lg" onPress={() => toast({ title: t("showcase.saved"), action: "success" })}>
          {t("showcase.saveChanges")}
        </Button>
      </View>
    </PageContainer>
  );
}
