import { Badge, Input, Pagination, Tab, TabList, Tabs, Text, useTheme } from "bokoui/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { useScreenTitle } from "@/components/layout/screen-title";
import { sampleRecords } from "@/lib/content/sample-records";

const PAGE_SIZE = 8;
const tabs = ["all", "active", "archived"] as const;
type ListTab = (typeof tabs)[number];

const isTab = (value: string | undefined): value is ListTab => tabs.some((tab) => tab === value);

/** Tab, filter text and page live in the route parameters (`?tab=&q=&page=`), so the view survives navigation. */
export default function FiltersScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string; q?: string; page?: string }>();
  useScreenTitle(t("examples.filtersTitle"));

  const tab: ListTab = isTab(params.tab) ? params.tab : "all";
  const q = params.q ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  const matches = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sampleRecords.filter((row) => (tab === "all" || row.status === tab) && row.name.toLowerCase().includes(needle));
  }, [tab, q]);
  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = matches.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // Changing the filter or the tab goes back to page 1.
  const setParams = (next: { tab?: ListTab; q?: string; page?: number }) =>
    router.setParams({
      tab: next.tab ?? (next.page ? params.tab : undefined),
      q: next.q ?? (next.page ? params.q : undefined),
      page: next.page ? String(next.page) : undefined,
    });

  return (
    <PageContainer>
      <PageHeader title={t("examples.filtersTitle")} description={t("examples.filtersDescription")} />
      <Input value={q} onChangeText={(text) => setParams({ tab, q: text })} placeholder={t("examples.filterPlaceholder")} accessibilityLabel={t("examples.filterPlaceholder")} autoCapitalize="none" autoCorrect={false} returnKeyType="search" />
      <Tabs value={tab} onValueChange={(value) => setParams({ tab: value as ListTab, q })}>
        <TabList>
          {tabs.map((value) => (
            <Tab key={value} value={value}>
              {value === "all" ? t("examples.tabAll") : t(value === "active" ? "examples.statusActive" : "examples.statusArchived")}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      <View style={{ borderWidth: tokens.borderWidth, borderColor: tokens.border, borderRadius: tokens.radiusCard, backgroundColor: tokens.surface }}>
        {rows.length === 0 ? (
          <Text muted style={{ padding: 16 }}>
            {t("examples.noMatches")}
          </Text>
        ) : (
          rows.map((row, index) => (
            <View key={row.id} style={{ minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, padding: 12, borderTopWidth: index === 0 ? 0 : tokens.borderWidth, borderColor: tokens.border }}>
              <Text numberOfLines={1} style={{ flex: 1 }}>
                {row.name}
              </Text>
              <Badge color="neutral">{row.department}</Badge>
            </View>
          ))
        )}
      </View>
      <Pagination page={current} pageCount={pageCount} onPageChange={(next) => setParams({ page: next })} label={t("examples.pages")} />
    </PageContainer>
  );
}
