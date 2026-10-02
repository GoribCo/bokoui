import { Card, CardHeader, Heading, Text } from "bokoui/expo";
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { useScreenTitle } from "@/components/layout/screen-title";

const sections = Array.from({ length: 14 }, (_, index) => index + 1);

export default function LongPageScreen() {
  const { t } = useTranslation();
  useScreenTitle(t("examples.longTitle"));
  return (
    <PageContainer>
      <PageHeader title={t("examples.longTitle")} description={t("examples.longDescription")} />
      {sections.map((number) => (
        <Card key={number}>
          <CardHeader>
            <Heading as="h2" size="md">
              {t("examples.longSection", { number })}
            </Heading>
          </CardHeader>
          <Text muted>{t("examples.longParagraph")}</Text>
        </Card>
      ))}
    </PageContainer>
  );
}
