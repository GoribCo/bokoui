import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/section";
import { PropTables } from "@/components/prop-table";
import { AccordionDemo } from "./accordion-demo";

export const metadata: Metadata = { title: "Accordion · UI Framework" };

export default function AccordionPage() {
  return (
    <Page>
      <PageHeader
        title="Accordion"
        description="Up/Down, Home and End move between headings; Enter and Space toggle. Closed panels are inert, so they leave the tab order."
      />
      <Section title="Single, controlled and multiple" note="Height animates with CSS grid rows and stops with reduced motion.">
        <AccordionDemo />
      </Section>

      <Section title="API" note="Generated from the package's TypeScript types. Every component also accepts standard HTML attributes and className.">
        <PropTables names={["Accordion", "AccordionItem", "AccordionTrigger"]} />
      </Section>
    </Page>
  );
}
