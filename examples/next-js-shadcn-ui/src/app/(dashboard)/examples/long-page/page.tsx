import { Heading, Text } from "@/components/layout/primitives";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Long page",
  description: "Many sections to exercise independent scrolling.",
  path: "/examples/long-page",
});

const sections = Array.from({ length: 14 }, (_, index) => index + 1);

export default function LongPage() {
  return (
    <PageContainer>
      <PageHeader title="Long page" description="Scroll: the header and sidebar stay in place, the footer arrives at the end." />
      {sections.map((number) => (
        <section key={number} className="flex flex-col gap-2">
          <Heading as="h2" size="lg">
            Section {number}
          </Heading>
          <Text>
            Placeholder copy for section {number}. It exists only to make the page tall enough that the content column
            scrolls on its own while the navigation stays put. Replace it with real content; the shell does not care
            what goes here, only that it stays inside the content area.
          </Text>
          <Text muted>A second paragraph keeps the rhythm realistic and gives long lines a chance to wrap.</Text>
        </section>
      ))}
    </PageContainer>
  );
}
