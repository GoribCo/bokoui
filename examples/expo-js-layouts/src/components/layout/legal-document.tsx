import { Heading, Text } from "bokoui/expo";
import { View } from "react-native";
import type { LegalDocumentContent } from "@/lib/content/legal";
import { PageContainer } from "./page-container";
import { useScreenTitle } from "./screen-title";

export interface LegalDocumentProps {
  content: LegalDocumentContent;
  /** Text before the date, e.g. "Last updated". */
  updatedLabel: string;
}

/** A long legal text: title, revision date and numbered sections with paragraphs and bullet lists. */
export function LegalDocument({ content, updatedLabel }: LegalDocumentProps) {
  useScreenTitle(content.title);
  return (
    <PageContainer size="md">
      <View style={{ gap: 8 }}>
        <Heading as="h1" size="2xl">
          {content.title}
        </Heading>
        <Text muted>{content.description}</Text>
        <Text variant="caption" muted>
          {updatedLabel}: {content.updated}
        </Text>
      </View>
      {content.sections.map((section, index) => (
        <View key={section.id} style={{ gap: 12 }}>
          <Heading as="h2" size="lg">
            {index + 1}. {section.title}
          </Heading>
          {section.paragraphs?.map((paragraph) => <Text key={paragraph}>{paragraph}</Text>)}
          {section.items?.map((item) => (
            <View key={item} style={{ flexDirection: "row", gap: 8, paddingLeft: 8 }}>
              <Text muted>•</Text>
              <Text style={{ flex: 1 }}>{item}</Text>
            </View>
          ))}
        </View>
      ))}
    </PageContainer>
  );
}
