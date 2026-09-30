import type { ReactNode } from "react";
import { Text } from "bokoui/react";
import { PageContainer } from "./page-container";
import { PageHeader } from "./page-header";

export interface StaticPageProps {
  title: string;
  description?: string;
  /** Paragraphs or any content; plain strings become body text. */
  children?: ReactNode;
}

/** Simple reading page (legal, help, settings placeholders): title, description and text. */
export function StaticPage({ title, description, children }: StaticPageProps) {
  return (
    <PageContainer>
      <PageHeader title={title} description={description} />
      {typeof children === "string" ? <Text>{children}</Text> : children}
    </PageContainer>
  );
}
