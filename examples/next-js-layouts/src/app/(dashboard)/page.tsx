import { Card, CardHeader, Grid, Heading, Text } from "bokoui/react";
import { ActiveOrganizationCard } from "@/components/examples/active-organization-card";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { formatNumber } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "next-intl/server";
import type { LocaleCode } from "@/types";

export const metadata = buildMetadata({
  title: "Dashboard",
  description: "Overview of the active organization.",
  path: "/",
});

const stats = [
  { label: "Open tasks", value: 128 },
  { label: "Completed this week", value: 1342 },
  { label: "Pending reviews", value: 17 },
];

export default async function DashboardPage() {
  const locale = (await getLocale()) as LocaleCode;
  return (
    <PageContainer>
      <PageHeader title="Dashboard" description="Content is a placeholder; the shell around it is the point." />
      <Grid>
        <ActiveOrganizationCard />
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <Text muted>{stat.label}</Text>
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
