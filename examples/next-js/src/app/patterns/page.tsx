import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/section";
import { PropTables } from "@/components/prop-table";
import { DashboardPattern, LayoutDemo, LoginPattern, SettingsPattern, WizardPattern } from "./patterns-demo";

export const metadata: Metadata = { title: "Patterns · UI Framework" };

export default function PatternsPage() {
  return (
    <Page>
      <PageHeader
        title="Patterns"
        description="Layout primitives, and pages assembled only from bokoui components: sign-in, settings, a dashboard and a wizard."
      />
      <Section title="Layout primitives" note="Stack, Inline, Grid and Container only arrange children; they never set colors.">
        <LayoutDemo />
      </Section>
      <Section title="Sign-in form" note="Required fields, hints, a loading button and a toast on success.">
        <LoginPattern />
      </Section>
      <Section title="Settings" note="Cards group related fields. Save stays disabled until something changes.">
        <SettingsPattern />
      </Section>
      <Section title="Dashboard" note="Stat cards with badges and progress, a table, and an empty state.">
        <DashboardPattern />
      </Section>
      <Section title="Multi-step wizard" note="Stepper shows progress; validation gates the Continue button; the step content is a live region.">
        <WizardPattern />
      </Section>

      <Section title="API" note="Generated from the package's TypeScript types. Every component also accepts standard HTML attributes and className.">
        <PropTables names={["Stack", "Inline", "Grid", "Container"]} />
      </Section>
    </Page>
  );
}
