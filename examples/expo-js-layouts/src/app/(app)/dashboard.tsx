import { Card, CardHeader, Grid, Heading, Text } from "bokoui/expo";
import { useTranslation } from "react-i18next";
import { ActiveOrganizationCard } from "@/components/examples/active-organization-card";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { useScreenTitle } from "@/components/layout/screen-title";
import { useLocale } from "@/hooks/use-locale";
import { formatNumber } from "@/lib/i18n/format";

const stats = [
  { key: "statOpenTasks", value: 128 },
  { key: "statCompleted", value: 1342 },
  { key: "statReviews", value: 17 },
] as const;

export default function DashboardScreen() {
  const { t } = useTranslation();
  const locale = useLocale();
  useScreenTitle(t("pages.dashboardTitle"));
  return (
    <PageContainer>
      <PageHeader title={t("pages.dashboardTitle")} description={t("pages.dashboardDescription")} />
      <Grid>
        <ActiveOrganizationCard />
        {stats.map((stat) => (
          <Card key={stat.key}>
            <CardHeader>
              <Text muted>{t(`pages.${stat.key}`)}</Text>
              <Heading as="h2" size="xl">
                {formatNumber(stat.value, locale)}
              </Heading>
            </CardHeader>
          </Card>
        ))}
      </Grid>
    </PageContainer>
  );
}
