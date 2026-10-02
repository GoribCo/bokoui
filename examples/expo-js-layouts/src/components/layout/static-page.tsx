import type { ReactNode } from "react";
import { Text } from "bokoui/expo";
import { PageContainer } from "./page-container";
import { PageHeader } from "./page-header";
import { useScreenTitle } from "./screen-title";

export interface StaticPageProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

/** A screen that is only a title, a description and some text; the starting point for placeholder screens. */
export function StaticPage({ title, description, children }: StaticPageProps) {
  useScreenTitle(title);
  return (
    <PageContainer size="md">
      <PageHeader title={title} description={description} />
      {typeof children === "string" ? <Text>{children}</Text> : children}
    </PageContainer>
  );
}
