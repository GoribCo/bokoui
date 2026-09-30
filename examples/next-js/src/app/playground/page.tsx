import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, CardHeader, Grid, Heading, Text } from "bokoui/react";
import { CodeBlock, Page, PageHeader, Section } from "@/components/section";

export const metadata: Metadata = { title: "Playground · UI Framework" };

const groups: { title: string; href: string; description: string; components: string[]; client?: string[] }[] = [
  { title: "Basics", href: "/", description: "Buttons, text fields and typography.", components: ["Button", "Input", "Heading", "Text", "Link"] },
  {
    title: "Forms",
    href: "/forms",
    description: "Everything for collecting input, with labels, hints and errors wired up.",
    components: ["FormField", "Label", "Textarea", "Checkbox", "Radio", "Switch", "Slider"],
    client: ["Select", "Combobox", "DatePicker", "Calendar", "Rating", "FileUpload"],
  },
  { title: "Data display", href: "/display", description: "Show information: status, people, content and steps.", components: ["Badge", "Avatar", "Tag", "Card", "Divider", "Image", "Stepper", "EmptyState"] },
  { title: "Table", href: "/table", description: "Semantic tables with sorting and paging.", components: ["Table", "Pagination"] },
  { title: "Feedback", href: "/feedback", description: "Tell people what is happening.", components: ["Alert", "Spinner", "Progress", "Skeleton"], client: ["Toast"] },
  { title: "Overlays", href: "/overlays", description: "Layers above the page, using the native dialog and Popover API.", components: [], client: ["Modal", "Drawer", "Tooltip", "Popover", "Menu", "CommandPalette"] },
  { title: "Tabs & Accordion", href: "/tabs", description: "Show one panel at a time, or expand sections.", components: [], client: ["Tabs", "Accordion"] },
  { title: "Navigation", href: "/navigation", description: "Move around: bars, trails and paging.", components: ["Breadcrumb", "Pagination", "Sidebar"], client: ["Navbar"] },
  { title: "Patterns", href: "/patterns", description: "Layout primitives and whole-page compositions.", components: ["Stack", "Inline", "Grid", "Container"] },
];

export default function PlaygroundPage() {
  const total = groups.reduce((n, g) => n + g.components.length + (g.client?.length ?? 0), 0);
  return (
    <Page>
      <PageHeader
        title="Playground"
        description={`${total} components, eight design styles, light and dark. Change the style in the header; every page updates.`}
      />

      <Section title="Get started" note="Tailwind CSS v4 and React 19. Components are styled by tokens, so a style is only a set of CSS variables.">
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-2">
            <Text variant="small" className="font-medium">
              1. Install
            </Text>
            <CodeBlock label="Install command">npm install bokoui</CodeBlock>
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <Text variant="small" className="font-medium">
              2. Import the styles
            </Text>
            <CodeBlock label="globals.css">{`/* globals.css */\n@import "tailwindcss";\n@import "bokoui/styles.css";`}</CodeBlock>
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <Text variant="small" className="font-medium">
              3. Use components
            </Text>
            <CodeBlock label="Usage">{`import { Button } from "bokoui/react";\nimport { Modal } from "bokoui/react/client";`}</CodeBlock>
          </div>
        </div>
        <Text variant="small" muted>
          <code>bokoui/react</code> works in Server Components. Components with state or effects come from <code>bokoui/react/client</code>. Add{" "}
          <code>ThemeScript</code> to <code>&lt;head&gt;</code> and wrap the app in <code>ThemeProvider</code> to switch styles without a flash.
        </Text>
      </Section>

      <Section title="Components" note="Each page shows variants, states and a generated API table.">
        <Grid cols={2} gap={4}>
          {groups.map((g) => (
            <Link key={g.title} href={g.href} className="focus-ring rounded-card">
              <Card interactive className="h-full">
                <CardHeader>
                  <Heading as="h3" size="md">
                    {g.title}
                  </Heading>
                  <Text variant="small" muted>
                    {g.description}
                  </Text>
                </CardHeader>
                <div className="flex flex-wrap gap-1.5">
                  {g.components.map((c) => (
                    <Badge key={c} size="sm" color="neutral">
                      {c}
                    </Badge>
                  ))}
                  {g.client?.map((c) => (
                    <Badge key={c} size="sm" variant="outline" color="accent" title="from bokoui/react/client">
                      {c}
                    </Badge>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </Grid>
        <Text variant="small" muted>
          Outlined badges come from <code>bokoui/react/client</code>.
        </Text>
      </Section>
    </Page>
  );
}
