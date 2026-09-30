import type { ReactNode } from "react";
import { Heading, Text } from "bokoui/react";

export interface PageHeaderProps {
  /** The page's single `h1` (FR-11.6). */
  title: string;
  description?: string;
  /** Buttons or links aligned to the end of the header. */
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
      <div className="flex min-w-0 flex-col gap-1">
        <Heading as="h1" className="text-title wrap-break-word">
          {title}
        </Heading>
        {description ? (
          <Text muted className="max-w-prose">
            {description}
          </Text>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
