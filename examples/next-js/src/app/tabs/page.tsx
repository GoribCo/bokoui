import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/section";
import { PropTables } from "@/components/prop-table";
import { TabsDemo } from "./tabs-demo";

export const metadata: Metadata = { title: "Tabs · UI Framework" };

export default function TabsPage() {
  return (
    <Page>
      <PageHeader title="Tabs" description="Arrow keys move and select, Home/End jump, and only the active tab is in the tab order." />
      <Section title="Variants" note="Underline, pills, vertical and controlled. The disabled tab is skipped by the arrows.">
        <TabsDemo />
      </Section>

      <Section title="API" note="Generated from the package's TypeScript types. Every component also accepts standard HTML attributes and className.">
        <PropTables names={["Tabs", "Tab", "TabPanel"]} />
      </Section>
    </Page>
  );
}
