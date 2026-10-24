import { Button, Card, Heading, Text } from "bokoui/expo/ui";
import { useTheme } from "bokoui/expo";
import { BarChart3, CalendarDays, CheckSquare, FileText, FolderOpen, MessageCircle, Plus, Users } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { IconTile } from "@/components/examples/icon-tile";
import { ListRow } from "@/components/examples/list-row";
import { PageContainer } from "@/components/layout/page-container";
import { useScreenTitle } from "@/components/layout/screen-title";

const projectColors = ["#8b7cf6", "#8ab4f8", "#f4a3a3"];

/** Sample screen: greeting, three stat tiles, upcoming list, quick actions, projects and a primary action. */
export default function ShowcaseHomeScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  useScreenTitle(t("showcase.homeTitle"));
  const icon = (Icon: typeof Users) => <Icon size={20} color={tokens.primary} />;
  const stats = [
    { Icon: CheckSquare, value: "12", label: t("showcase.tasks") },
    { Icon: CalendarDays, value: "3", label: t("showcase.meetings") },
    { Icon: BarChart3, value: "78%", label: t("showcase.progress") },
  ];
  const upcoming = [
    { Icon: CalendarDays, title: t("showcase.designReview"), sub: "10:00 – 11:00" },
    { Icon: Users, title: t("showcase.teamSync"), sub: "14:00 – 14:30" },
    { Icon: FileText, title: t("showcase.updateDocs"), sub: t("showcase.dueToday") },
  ];
  const actions = [
    { Icon: Plus, label: t("showcase.newTask") },
    { Icon: MessageCircle, label: t("showcase.messages") },
    { Icon: CalendarDays, label: t("showcase.calendar") },
    { Icon: FolderOpen, label: t("showcase.files") },
  ];
  const projects = [
    { title: t("showcase.projectApp"), sub: t("showcase.updated2h") },
    { title: t("showcase.projectSite"), sub: t("showcase.updated1d") },
    { title: t("showcase.projectSystem"), sub: t("showcase.updated3d") },
  ];

  return (
    <PageContainer size="md">
      <View style={{ gap: 4 }}>
        <Heading as="h1" size="3xl">
          {t("showcase.homeTitle")}
        </Heading>
        <Text muted>{t("showcase.homeSubtitle")}</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        {stats.map(({ Icon, value, label }) => (
          <Card key={label} padding="sm" style={{ flex: 1, gap: 8 }}>
            <IconTile size={36}>{icon(Icon)}</IconTile>
            <View>
              <Text style={{ fontSize: 24, lineHeight: 30, fontWeight: "700" }}>{value}</Text>
              <Text variant="caption" muted>
                {label}
              </Text>
            </View>
          </Card>
        ))}
      </View>

      <View style={{ gap: 8 }}>
        <Heading as="h2" size="md">
          {t("showcase.upcoming")}
        </Heading>
        <Card padding="none" style={{ gap: 0, overflow: "hidden" }}>
          {upcoming.map(({ Icon, title, sub }) => (
            <ListRow key={title} icon={<IconTile>{icon(Icon)}</IconTile>} title={title} subtitle={sub} onPress={() => undefined} />
          ))}
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <Heading as="h2" size="md">
          {t("showcase.quickActions")}
        </Heading>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {actions.map(({ Icon, label }) => (
            <View key={label} style={{ flex: 1, alignItems: "center", gap: 6 }}>
              <Button variant="soft" color="neutral" iconOnly accessibilityLabel={label} leftIcon={<Icon size={22} color={tokens.primary} />} style={{ width: "100%", minHeight: 56, alignSelf: "stretch" }} />
              <Text variant="caption" muted numberOfLines={1}>
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
          <Heading as="h2" size="md">
            {t("showcase.projects")}
          </Heading>
          <Text variant="small" style={{ color: tokens.primary, fontWeight: "600" }}>
            {t("showcase.seeAll")}
          </Text>
        </View>
        <Card padding="none" style={{ gap: 0, overflow: "hidden" }}>
          {projects.map((project, index) => (
            <ListRow key={project.title} icon={<IconTile color={projectColors[index]} />} title={project.title} subtitle={project.sub} onPress={() => undefined} />
          ))}
        </Card>
      </View>

      <Button fullWidth size="lg" leftIcon={<Plus size={18} color={tokens.primaryFg} />}>
        {t("showcase.newTask")}
      </Button>
    </PageContainer>
  );
}
