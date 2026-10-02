import { Button, Card, Heading, Text } from "bokoui/expo/ui";
import { useTheme } from "bokoui/expo";
import { CircleDollarSign, Percent, ShoppingBag, Sparkles, Users } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ActiveOrganizationCard } from "@/components/examples/active-organization-card";
import { AreaChart } from "@/components/examples/area-chart";
import { BarList } from "@/components/examples/bar-list";
import { ChartCard } from "@/components/examples/chart-card";
import { StatCard } from "@/components/examples/stat-card";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { useScreenTitle } from "@/components/layout/screen-title";
import { useLocale } from "@/hooks/use-locale";
import { formatNumber } from "@/lib/i18n/format";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const revenue = [18400, 31200, 22800, 37420, 28900, 35100, 24600];
const audience = [1200, 1500, 3100, 3800, 3600, 1900, 4100];
const products = [
  { label: "iPad", percent: 17 },
  { label: "Mouse", percent: 47 },
  { label: "Watch", percent: 55 },
  { label: "Mobile", percent: 65 },
  { label: "Laptop", percent: 5 },
];

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const locale = useLocale();
  useScreenTitle(t("pages.dashboardTitle"));
  const icon = (Icon: typeof Users) => <Icon size={18} color={tokens.primary} />;

  const kpis = [
    { key: "kpiRevenue", value: formatNumber(728450, locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 }), delta: 7.4, icon: CircleDollarSign },
    { key: "kpiSales", value: formatNumber(1284, locale), delta: 5.9, icon: ShoppingBag },
    { key: "kpiClients", value: formatNumber(642, locale), delta: 3.2, icon: Users },
    { key: "kpiConversion", value: `${formatNumber(4.8, locale)}%`, delta: -1.1, icon: Percent },
  ] as const;

  return (
    <PageContainer>
      <PageHeader title={t("pages.dashboardTitle")} description={t("pages.dashboardDescription")} />
      <ActiveOrganizationCard />
      {/* Two columns even on a phone (the bokoui Grid would stack them below 640 px). */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {kpis.map((kpi) => (
          <View key={kpi.key} style={{ flexGrow: 1, flexBasis: 150, minWidth: 0 }}>
            <StatCard label={t(`pages.${kpi.key}`)} value={kpi.value} delta={kpi.delta} period={t("pages.last30")} icon={icon(kpi.icon)} />
          </View>
        ))}
      </View>

      <Card variant="outline" style={{ borderStyle: "dashed", flexDirection: "column" }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: tokens.bg }}>
            <Sparkles size={18} color={tokens.primary} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Heading as="h2" size="md">
              {t("pages.upgradeTitle")}
            </Heading>
            <Text variant="small" muted>
              {t("pages.upgradeBody")}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button size="sm" style={{ flex: 1 }}>
            {t("pages.upgradeAction")}
          </Button>
          <Button size="sm" variant="soft" color="neutral" style={{ flex: 1 }}>
            {t("pages.learnMore")}
          </Button>
        </View>
      </Card>

      <ChartCard title={t("pages.salesGrowth")} period={t("pages.thisYear")} value={`${formatNumber(701.34, locale)}k`} delta={14.5} caption={t("pages.totalRevenueCaption")}>
        <AreaChart data={months.map((label, i) => ({ label, value: revenue[i] }))} highlight={3} format={(value) => formatNumber(value, locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 })} summary={t("pages.salesGrowth")} />
      </ChartCard>

      <ChartCard title={t("pages.topProducts")} period={t("pages.thisYear")} value={formatNumber(701, locale)} delta={1.5}>
        <BarList items={products} />
      </ChartCard>

      <ChartCard title={t("pages.audienceGrowth")} period={t("pages.thisYear")} value={`${formatNumber(1.5, locale)}k`} delta={8.5} caption={t("pages.totalUsersCaption")}>
        <AreaChart data={months.map((label, i) => ({ label, value: audience[i] }))} highlight={3} format={(value) => formatNumber(value, locale)} summary={t("pages.audienceGrowth")} />
      </ChartCard>
    </PageContainer>
  );
}
