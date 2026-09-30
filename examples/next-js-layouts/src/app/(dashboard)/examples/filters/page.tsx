import { Suspense } from "react";
import { FilterableList } from "@/components/examples/filterable-list";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Filters",
  description: "Tabs, filter and pagination kept in the URL.",
  path: "/examples/filters",
});

export default function FiltersPage() {
  return (
    <PageContainer>
      <PageHeader title="Filters" description="Tab, filter and page are URL state (nuqs): copy the address to share the view." />
      <Suspense>
        <FilterableList />
      </Suspense>
    </PageContainer>
  );
}
