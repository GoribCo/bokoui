import { BarChart3, CalendarDays, CheckSquare, FileText, FolderOpen, MessageCircle, Plus, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button, Card, Heading, Text } from "bokoui/react";
import { PageContainer } from "@/components/layout/page-container";
import { IconTile } from "./icon-tile";
import { ListRow } from "./list-row";

const projectColors = ["#8b7cf6", "#8ab4f8", "#f4a3a3"];

/** Sample screen: greeting, three stat tiles, upcoming list, quick actions, projects and a primary action. */
export async function ShowcaseHome() {
  const t = await getTranslations("showcase");
  const stats = [
    { Icon: CheckSquare, value: "12", label: t("tasks") },
    { Icon: CalendarDays, value: "3", label: t("meetings") },
    { Icon: BarChart3, value: "78%", label: t("progress") },
  ];
  const upcoming = [
    { Icon: CalendarDays, title: t("designReview"), sub: "10:00 – 11:00" },
    { Icon: Users, title: t("teamSync"), sub: "14:00 – 14:30" },
    { Icon: FileText, title: t("updateDocs"), sub: t("dueToday") },
  ];
  const actions = [
    { Icon: Plus, label: t("newTask") },
    { Icon: MessageCircle, label: t("messages") },
    { Icon: CalendarDays, label: t("calendar") },
    { Icon: FolderOpen, label: t("files") },
  ];
  const projects = [
    { title: t("projectApp"), sub: t("updated2h") },
    { title: t("projectSite"), sub: t("updated1d") },
    { title: t("projectSystem"), sub: t("updated3d") },
  ];

  return (
    <PageContainer size="md">
      <header className="flex flex-col gap-1">
        <Heading as="h1" className="text-display">
          {t("homeTitle")}
        </Heading>
        <Text muted>{t("homeSubtitle")}</Text>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ Icon, value, label }) => (
          <Card key={label} padding="sm" className="gap-2">
            <IconTile className="size-9">
              <Icon />
            </IconTile>
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-caption text-muted-foreground">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      <section aria-labelledby="upcoming-title" className="flex flex-col gap-2">
        <Heading as="h2" size="md" id="upcoming-title">
          {t("upcoming")}
        </Heading>
        <Card padding="none" className="divide-y divide-border overflow-hidden">
          {upcoming.map(({ Icon, title, sub }) => (
            <ListRow key={title} icon={<IconTile><Icon /></IconTile>} title={title} subtitle={sub} href="/examples/table" />
          ))}
        </Card>
      </section>

      <section aria-labelledby="actions-title" className="flex flex-col gap-2">
        <Heading as="h2" size="md" id="actions-title">
          {t("quickActions")}
        </Heading>
        <div className="grid grid-cols-4 gap-3">
          {actions.map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <Button variant="soft" color="neutral" aria-label={label} className="h-14 w-full [&_svg]:size-5.5 [&_svg]:text-primary">
                <Icon aria-hidden="true" />
              </Button>
              <span className="max-w-full truncate text-caption text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="projects-title" className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <Heading as="h2" size="md" id="projects-title">
            {t("projects")}
          </Heading>
          <span data-tone="primary" className="text-nav font-semibold text-(--tone-ink)">
            {t("seeAll")}
          </span>
        </div>
        <Card padding="none" className="divide-y divide-border overflow-hidden">
          {projects.map((project, index) => (
            <ListRow key={project.title} icon={<IconTile color={projectColors[index]} />} title={project.title} subtitle={project.sub} href="/examples/filters" />
          ))}
        </Card>
      </section>

      <Button size="lg" fullWidth>
        <Plus aria-hidden="true" />
        {t("newTask")}
      </Button>
    </PageContainer>
  );
}
