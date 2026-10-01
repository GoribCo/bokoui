import { Heading, Text } from "@/components/layout/primitives";
import type { LegalDocumentContent } from "@/lib/content/legal";
import { PageContainer } from "./page-container";

export interface LegalDocumentProps {
  content: LegalDocumentContent;
  /** Text before the date, e.g. "Last updated". */
  updatedLabel?: string;
  /** Accessible name of the table of contents. */
  contentsLabel?: string;
}

/** A long legal text: title, revision date, a sticky table of contents from `lg` up, and numbered sections. */
export function LegalDocument({
  content,
  updatedLabel = "Last updated",
  contentsLabel = "On this page",
}: LegalDocumentProps) {
  return (
    <PageContainer size="lg">
      <header className="flex flex-col gap-2 border-b border-border pb-6">
        <Heading as="h1" size="3xl">
          {content.title}
        </Heading>
        <Text muted>{content.description}</Text>
        <Text muted className="text-caption">
          {updatedLabel}: {content.updated}
        </Text>
      </header>

      <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        <nav aria-label={contentsLabel} className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-2 text-caption font-semibold tracking-wide text-muted-foreground uppercase">{contentsLabel}</p>
          <ol className="flex flex-col gap-1 text-nav">
            {content.sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="flex gap-2 rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span aria-hidden="true" className="w-5 shrink-0 tabular-nums">
                    {index + 1}.
                  </span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="flex max-w-3xl flex-col gap-8">
          {content.sections.map((section, index) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="flex scroll-mt-6 flex-col gap-3">
              <Heading as="h2" size="lg" id={`${section.id}-title`}>
                {index + 1}. {section.title}
              </Heading>
              {section.paragraphs?.map((paragraph) => <Text key={paragraph}>{paragraph}</Text>)}
              {section.items ? (
                <ul className="flex list-disc flex-col gap-1.5 ps-6 marker:text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item}>
                      <Text as="span">{item}</Text>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>
      </div>
    </PageContainer>
  );
}
