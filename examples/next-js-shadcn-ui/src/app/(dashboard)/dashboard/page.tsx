import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid } from "@/components/layout/primitives";
import { ActiveOrganizationCard } from "@/components/examples/active-organization-card";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { formatNumber } from "@/lib/i18n/format";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "next-intl/server";
import type { LocaleCode } from "@/lib/types";

export const metadata = buildMetadata({
  title: "Dashboard",
  description: "Overview of the active organization.",
  path: "/dashboard",
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
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{formatNumber(stat.value, locale)}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </Grid>
    </PageContainer>
  );
}
